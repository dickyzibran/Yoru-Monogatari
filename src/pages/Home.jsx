import { useState, useEffect } from "react";
import { stories } from "../data/stories";
import StoryList from "../components/StoryList";
import StoryViewer from "../components/StoryViewer";

function Home() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cerpen-theme") || "midnight";
  });

  const [selectedStory, setSelectedStory] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("cerpen-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem("cerpen-completed");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cerpen-theme", theme);
    const body = document.body;
    body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cerpen-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("cerpen-completed", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    if (selectedStory) {
      document.title = `${selectedStory.title} — oleh ${selectedStory.author} | Cerpen Reader`;
    } else {
      document.title = "Cerpen Reader — Pustaka Sastra Estetis";
    }
  }, [selectedStory]);

  const toggleFavorite = (storyId) => {
    setFavorites(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId) 
        : [...prev, storyId]
    );
  };

  const toggleCompleted = (storyId) => {
    setCompleted(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId) 
        : [...prev, storyId]
    );
  };

  return (
    <div className="container animate-fade-in" id="main-app-container">
      <header className={`header-container ${selectedStory ? "header-hidden-mobile" : ""}`}>
        <div 
          onClick={() => setSelectedStory(null)} 
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
          id="header-logo"
        >
          <img 
            src={`${import.meta.env.BASE_URL}icon.png`}
            alt="Cerpen Reader Logo" 
            style={{ width: "36px", height: "36px", objectFit: "contain" }} 
          />
          <div>
            <h1 className="font-main header-title">
              Yoru Monogatari
            </h1>
            <p className="header-subtitle">
              Pojok Baca Cerpen
            </p>
          </div>
        </div>
        <div className="theme-selector-panel" id="theme-selector-panel">
          <button 
            onClick={() => setTheme("midnight")} 
            style={{ 
              padding: "6px 12px", 
              fontSize: "12px", 
              borderRadius: "20px", 
              border: theme === "midnight" ? "1.5px solid var(--accent)" : "1px solid var(--card-border)",
              color: theme === "midnight" ? "var(--accent)" : "var(--text-secondary)"
            }}
            id="theme-btn-midnight"
          >
            🌌 <span className="theme-btn-text">Gelap</span>
          </button>
          <button 
            onClick={() => setTheme("sepia")} 
            style={{ 
              padding: "6px 12px", 
              fontSize: "12px", 
              borderRadius: "20px", 
              border: theme === "sepia" ? "1.5px solid var(--accent)" : "1px solid var(--card-border)",
              color: theme === "sepia" ? "var(--accent)" : "var(--text-secondary)"
            }}
            id="theme-btn-sepia"
          >
            📜 <span className="theme-btn-text">Sepia</span>
          </button>
          <button 
            onClick={() => setTheme("light")} 
            style={{ 
              padding: "6px 12px", 
              fontSize: "12px", 
              borderRadius: "20px", 
              border: theme === "light" ? "1.5px solid var(--accent)" : "1px solid var(--card-border)",
              color: theme === "light" ? "var(--accent)" : "var(--text-secondary)"
            }}
            id="theme-btn-light"
          >
            ☀️ <span className="theme-btn-text">Terang</span>
          </button>
        </div>
      </header>
      
      <main className="main-grid" id="main-content-layout">
        <div 
          style={{ 
            display: selectedStory ? "none" : "block", 
            width: "100%",
            minWidth: 0
          }}
          className="desktop-visible-block"
          id="left-pane"
        >
          <StoryList 
            stories={stories} 
            selectedStory={selectedStory}
            onSelect={setSelectedStory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            favorites={favorites}
            completed={completed}
            toggleFavorite={toggleFavorite}
          />
        </div>
        <div 
          style={{ 
            display: selectedStory ? "block" : "none", 
            width: "100%",
            minWidth: 0
          }}
          className="desktop-visible-block"
          id="right-pane"
        >
          {selectedStory ? (
            <StoryViewer 
              story={selectedStory} 
              onBack={() => setSelectedStory(null)} 
              isFavorite={favorites.includes(selectedStory.id)}
              onToggleFavorite={() => toggleFavorite(selectedStory.id)}
              isCompleted={completed.includes(selectedStory.id)}
              onToggleCompleted={() => toggleCompleted(selectedStory.id)}
              theme={theme}
              setTheme={setTheme}
            />
          ) : (
            <div 
              className="glass-panel" 
              style={{ 
                height: "100%", 
                minHeight: "400px", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center", 
                padding: "48px",
                textAlign: "center"
              }}
              id="empty-viewer-fallback"
            >
              <div 
                style={{ 
                  width: "72px", 
                  height: "72px", 
                  borderRadius: "50%", 
                  background: "var(--accent-light)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "32px",
                  marginBottom: "24px",
                  color: "var(--accent)"
                }}
              >
                📖
              </div>
              <h2 className="font-main" style={{ fontSize: "24px", marginBottom: "12px" }}>
                Selamat Datang di Pojok Baca Cerpen
              </h2>
              <p style={{ opacity: 0.7, maxWidth: "320px", fontSize: "14px", lineHeight: "1.6" }}>
                Pilih salah satu karya sastra cerpen terbaik dari daftar di samping untuk memulai perjalanan imajinasi Anda.
              </p>
            </div>
          )}
        </div>
      </main>
      <style>{`
        @media (min-width: 900px) {
          #left-pane {
            display: block !important;
          }
          #right-pane {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;