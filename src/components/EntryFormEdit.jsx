import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EntryFormEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [originalEntry, setOriginalEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Fetch the entry data when component mounts
  useEffect(() => {
    fetchEntry();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [id]);

  const fetchEntry = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/entries/${id}`);
      const entry = response.data;
      
      setContent(entry.content);
      if (entry.file_path) {
        setAudioPreviewUrl(entry.file_path);
      }
      setOriginalEntry(entry);
      setError(null);
    } catch (err) {
      setError('Failed to fetch entry. Please try again.');
      console.error('Error fetching entry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // If we have a Cloudinary URL
      if (audioPreviewUrl) {
        // Create a temporary anchor element
        const link = document.createElement('a');
        
        // Fetch the audio file
        const response = await fetch(audioPreviewUrl);
        const blob = await response.blob();
        
        // Create a local URL for the blob
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Set up the download
        link.href = downloadUrl;
        link.download = `audio-entry-${id}.${getFileExtension(audioPreviewUrl)}`;
        
        // Append to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error downloading audio:', error);
      setError('Failed to download audio file. Please try again.');
    }
  };

  // Helper function to get file extension from URL
  const getFileExtension = (url) => {
    // Default to mp3 if we can't determine the extension
    if (!url) return 'mp3';
    
    const extension = url.split('.').pop().toLowerCase();
    // Check if it's a known audio extension
    const validExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
    return validExtensions.includes(extension) ? extension : 'mp3';
  };

  // Text to Speech
  const handleTextToSpeech = () => {
    if (!content) return;
    
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    // Create a temporary audio URL for preview
    const audioBlob = new Blob([utterance], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioPreviewUrl(audioUrl);
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

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your microphone permissions.');
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

  // Update entry
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!content && !audioFile && !audioPreviewUrl) {
      setError('Please provide either text content or an audio file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (audioFile) {
        formData.append('audio', audioFile);
      }

      await axios.put(`${import.meta.env.VITE_BACKEND}/api/entries/${id}`, formData);
      navigate('/');
    } catch (error) {
      console.error('Error updating entry:', error);
      setError('Failed to update entry. Please try again.');
    }
  };

  // Delete entry
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND}/api/entries/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting entry:', error);
        setError('Failed to delete entry. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading entry...</div>;
  }

  if (error && !originalEntry) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Entries
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <h1 className="text-xl font-semibold mb-4">Edit Entry</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter your text content here"
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={handleTextToSpeech}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Text As Speech
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Audio
          </button>
        </div>
        {audioPreviewUrl && (
          <audio controls>
            <source src={audioPreviewUrl} />
            Your browser does not support the audio element.
          </audio>
        )}
        <div className="mb-4">
          {isRecording ? (
            <div>
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Stop Recording
              </button>
              <p className="text-sm text-gray-500 mt-2">{formatTime(recordingTime)}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start Recording
            </button>
          )}
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryFormEdit;
