import axios from "axios";

function Logout({ loginUsername,setLoginUsername,toggleLOGIN,settoggleLOGIN }) {
    const logOut = () => {
        axios.post(`${import.meta.env.VITE_BACKEND_API}/newusers/logout`)
          .then(res => {
            console.log(res);
            // Perform further actions after successful logout
            // setLoginUsername("Sky Gazer");
            settoggleLOGIN(!toggleLOGIN);
            window.location.reload();
        })
          .catch(error => {
            console.error(error);
            // Handle errors gracefully
          });
      };
      

  return (
    <div style={{margin:"right", width:"30px", backgroundColor:"#00000000", color:"black"}} onClick={logOut}>🔒 Logout</div>
  );
}

export default Logout;
