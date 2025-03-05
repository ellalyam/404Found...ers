import { useEffect, useState } from "react";
import "../styling/home.scss";
// import { UserDataService } from "../services/userDataService";
import { useNavigate } from "react-router-dom";
import { SuggestionInterface } from "../components/suggestion";
import { ComponentMapper } from "../services/componentMapper";
import "../styling/suggestionComponent.scss";
import Sidebar from "../components/sidebar";
import { UserDataService } from "../services/userDataService";

const fakePreviousSuggestions = {
  suggestions: [
    {
      mood: "Anger",
      name: "1",
      id: "randomId",
      dateSuggested: new Date("2025-02-24"),
      tracks: [
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/default_cover.png",
        },
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/default_cover.png",
        },
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/default_cover.png",
        },
      ],
    },
    {
      mood: "Happiness",
      name: "2",
      id: "randomId",
      dateSuggested: new Date("2025-02-24"),
      tracks: [
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/default_cover.png",
        },
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/default_cover.png",
        },
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/default_cover.png",
        },
      ],
    },
    {
      mood: "Sadness",
      name: "3",
      id: "randomId",
      dateSuggested: new Date("2025-02-24"),
      tracks: [
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/default_cover.png",
        },
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/default_cover.png",
        },
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/default_cover.png",
        },
      ],
    },
  ],
};


export default function Home() {
  const [previousUserSuggestions, setPreviousUserSuggestions] =
    useState<SuggestionInterface[]>();
  //const [userAccountData, setUserAccountData] = useState([]);

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    const fetchPreviousSuggestions = async () => {
      const previousSuggestions =
        await UserDataService.fetchPreviousSuggestions();
      setPreviousUserSuggestions(previousSuggestions.suggestions);
    };

    fetchPreviousSuggestions();

    //mapper functions
  });

  return (
    <div className="pageContainer">
      <Sidebar />
      <section className="homePageBody">
        <div className="homePageTitleContainer">
          <h1 className="title">Tune/In</h1>
        </div>

        <div className="suggestionContainer">
          <div className="titleRow">
            <h2 id="name" className="suggestionElement">
              #
            </h2>
            <h2 id="emotion" className="suggestionElement">
              Emotion
            </h2>
            <h2 id="tracks" className="suggestionElement">
              Tracks
            </h2>
            <h2 id="date" className="suggestionElement">
              Date Suggested
            </h2>
          </div>
          <div className="space"></div>
          {ComponentMapper.mapSuggestions(previousUserSuggestions)}
        </div>
      </section>
    </div>
  );
}
