import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserInterface } from "../services/userDataService";
//import { UserDataService } from "../services/userDataService";

/*
 *const fakeAccountData = {
 *  userProfileImage: "/olivia_rodrigo.png",
 *  username: "Olivia Rodrigo",
 *  spotifyUserId: "abc123def456ghi789",
 *};
 */

import { UserDataService } from "../services/userDataService";
import { SpotifyLoginService } from "../services/spotifyLoginService";

export default function Sidebar() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [userAccountData, setUserAccountData] = useState<UserInterface>({
    userProfileImage: "/default_user.png",
    username: "Fetching Username...",
    spotifyUserId: "userid",
  });

  const handleAccountDeletion = () => {
    UserDataService.deleteUser().then((result) => {
      if (result) {
        navigate("/")
      }
    })
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    const fetchUserAccountData = async () => {
      const fetchedUserAccountData = await SpotifyLoginService.getUserProfile();
      setUserAccountData(fetchedUserAccountData);
    };
    fetchUserAccountData();
  }, []);

  return (
    <section className="homePageSidebar">
      <div
        className="accountInfo"
        onClick={() => {
          navigate("/account");
        }}>
        <img
          className="accountPFP"
          src={userAccountData.userProfileImage}
          alt="default pfp"
        />
        <h3 className="accountUsername">{userAccountData.username}</h3>
      </div>
      <button
        className="sidebarButton"
        onClick={() => {
          localStorage.setItem("isLoggedIn", "false");
          console.log("false");
          navigate("/");
        }}>
        Logout
      </button>

      <button
        className="sidebarButton"
        onClick={() => {
          navigate("/suggestion");
        }}>
        New Suggestion
      </button>
      <button
        className="sidebarButton"
        onClick={handleAccountDeletion}>
        Delete Account
      </button>
    </section>
  );
}
