// src/components/EntryForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EntryForm = ({ entryId = null }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (entryId) {
      fetchEntry();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [entryId]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/entries/${entryId}`);
      setContent(response.data.content);
      if (response.data.file_path) {
        setAudioPreviewUrl(response.data.file_path);
      }
    } catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  // Text to Speech
  const handleTextToSpeech = () => {
    if (!content) return;
    
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAudioFile(file);
    setAudioPreviewUrl(URL.createObjectURL(file));
    await convertAudioToText(file);
  };

  // Convert uploaded audio to text
  const convertAudioToText = async (audioFile) => {
    setIsProcessing(true);
    try {
      // Using Web Speech API for speech recognition
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join(' ');
        
        setContent(prevContent => {
          const newContent = prevContent ? `${prevContent}\n${transcript}` : transcript;
          return newContent;
        });
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsProcessing(false);
      };

      // Convert audio file to audio element and play it
      const audio = new Audio(URL.createObjectURL(audioFile));
      audio.addEventListener('ended', () => {
        recognition.stop();
      });

      recognition.start();
      audio.play();
    } catch (error) {
      console.error('Error converting audio to text:', error);
      setIsProcessing(false);
    }
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioFile(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        convertAudioToText(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Start recording timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content && !audioFile) {
      alert('Please provide either text content or an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (audioFile) {
      formData.append('audio', audioFile);
    }

    try {
      if (entryId) {
        await axios.put(`http://localhost:5000/api/entries/${entryId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/entries', formData);
      }
      
      // Reset form
      setContent('');
      setAudioFile(null);
      setAudioPreviewUrl('');
      
      // Navigate to the entries list
      navigate('/');
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
        <h1>Entry to Database Here</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
        Audio Upload/Record with Text Integration
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm min-h-[150px]"
            placeholder="Enter your content or record audio..."
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleTextToSpeech}
              disabled={!content || isProcessing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Play Text as Speech
            </button>
            
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`px-4 py-2 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md disabled:opacity-50`}
            >
              {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Start Recording'}
            </button>

            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isProcessing || isRecording}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {audioPreviewUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Preview
              </label>
              <audio
                controls
                src={audioPreviewUrl}
                className="w-full"
              />
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="text-center py-2 text-gray-600">
            Converting audio to text...
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || (!content && !audioFile)}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {entryId ? 'Update Entry' : 'Create Entry'}
        </button>
      </form>
    </div>
  );
};

export default EntryForm