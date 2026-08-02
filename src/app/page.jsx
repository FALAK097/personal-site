export const dynamic = "force-dynamic";

import { Navbar } from "@/components/navbar";
import { Profile } from "@/components/profile";
import { Footer } from "@/components/footer";
import { GitHubCalendarChart } from "@/components/custom/github-calendar-chart";
import { RecentPosts } from "@/components/blog/recent-posts";
import { getAllPosts } from "@/lib/blog-source";
// import { getNowPlaying } from "@/actions/spotify";
// import { SpotifyNowPlaying } from "@/components/custom/spotify-now-playing";
import { RecentProjects } from "@/components/recent-projects";
import { projects } from "@/lib/project-data";
// import { FootballGoalAnimation } from "@/components/custom/football-goal-animation";

export const metadata = {
  title: "Falak Gala",
  description:
    "Welcome to my personal portfolio. I'm a developer passionate about building great software and sharing my knowledge through writing.",
};

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);
  const recentProjects = projects.slice(0, 5);
  let spotifyData;

  try {
    spotifyData = await getNowPlaying();
  } catch (error) {
    console.error("Failed to fetch Spotify data:", error);
    spotifyData = null;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)]">
      <Navbar />
      <main className="container flex-1 px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* <Profile spotifyData={spotifyData} /> */}
          <Profile />
          <RecentProjects projects={recentProjects} />
          <RecentPosts posts={recentPosts} />
          <GitHubCalendarChart />
        </div>
      </main>
      {/* <div className="mx-auto max-w-4xl container">
        <FootballGoalAnimation />
      </div> */}
      <Footer />
    </div>
  );
}
