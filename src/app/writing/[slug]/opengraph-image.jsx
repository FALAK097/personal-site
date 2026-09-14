import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog-source";

export const alt = "Falak Gala's Writing";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#082d48",
            color: "#c9eaff",
            fontSize: 48,
          }}
        >
          Post Not Found
        </div>
      )
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#eff9ff",
          backgroundImage: "radial-gradient(circle at 25px 25px, #9edcff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #9edcff 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "50px",
            boxShadow: "0 20px 40px rgba(92, 190, 255, 0.18)",
            border: "2px solid #c9eaff",
          }}
        >
          {/* Top Bar: Logo & Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(to bottom right, #9edcff, #5cbeff, #075c96)",
                  boxShadow: "0 0 12px rgba(92, 190, 255, 0.5)",
                }}
              />
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#082d48",
                  letterSpacing: "-0.05em",
                }}
              >
                Falak<span style={{ color: "#168fdc" }}>.</span>
              </span>
            </div>

            {/* Date */}
            {post.date && (
              <span
                style={{
                  fontSize: 24,
                  color: "#075c96",
                  fontWeight: 500,
                }}
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
            <h1
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#082d48",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: "20px",
              }}
            >
              {post.title}
            </h1>

            <p
              style={{
                fontSize: 28,
                color: "#075c96",
                lineHeight: 1.4,
                fontWeight: 500,
                margin: 0,
                paddingRight: "60px",
              }}
            >
              {post.description?.length > 150 
                ? post.description.substring(0, 150) + "..." 
                : post.description}
            </p>
          </div>

          {/* Footer: Tags */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {post.tags && post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 24,
                    color: "#075c96",
                    backgroundColor: "#eff9ff",
                    padding: "8px 24px",
                    borderRadius: "999px",
                    fontWeight: 600,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
