import { Navbar } from "@/components/navbar";
import { Profile } from "@/components/profile";
import { Footer } from "@/components/footer";
import { GitHubCalendarChart } from "@/components/custom/github-calendar-chart";
import { RecentPosts } from "@/components/blog/recent-posts";
import { getAllPosts } from "@/lib/blog-source";
import { RecentProjects } from "@/components/recent-projects";
import { projects } from "@/lib/project-data";
import { createMetadata } from "@/lib/metadata";
// import { FootballGoalAnimation } from "@/components/custom/football-goal-animation";

export const metadata = createMetadata({
  title: "Falak Gala",
  description:
    "Welcome to my personal portfolio. I'm a developer passionate about building great software and sharing my knowledge through writing.",
  path: "/",
});

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);
  const recentProjects = projects.slice(0, 5);
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-20 sm:space-y-24">
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
