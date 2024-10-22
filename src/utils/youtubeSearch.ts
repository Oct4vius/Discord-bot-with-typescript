import axios from "axios";
import { queueType } from "../types/index.types";

const apiKey: string | undefined = process.env.API_KEY_GOOGLE;
const apiUrl: string = "https://www.googleapis.com/youtube/v3";


export const youtubeSearch = async (
    searchTerm: string
  ): Promise<queueType | undefined> => {
    const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchTerm}`;
  
    try {
      const response = await axios.get(url);
  
      const video = response.data.items[0];
  
      let videoID = video.id.videoId;
  
      const youtubeSearch: queueType = {
        url: `https://www.youtube.com/watch?v=${videoID}`,
        thumbnail: video.snippet.thumbnails.high.url,
        title: video.snippet.title,
        author: video.snippet.channelTitle,
      };
  
      return youtubeSearch;
    } catch (error) {
      console.log(error);
    }
  };