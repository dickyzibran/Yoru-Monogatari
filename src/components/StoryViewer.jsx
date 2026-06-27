import { useState, useEffect, useRef, useMemo } from "react";

function StoryViewer({ 
  story, 
  onBack, 
  isFavorite, 
  onToggleFavorite, 
  isCompleted, 
  onToggleCompleted,
  theme,
  setTheme
}) {
  const [fontSize, setFontSize] = useState(18); // default font size in pixels
  const [fontFamily, setFontFamily] = useState("serif"); // 'serif' or 'sans-serif'
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const element = containerRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      if (totalHeight > 0) {
        const scrolled = (element.scrollTop / totalHeight) * 100;
        setScrollProgress(Math.min(Math.max(scrolled, 0), 100));
      } else {
        setScrollProgress(100);
      }
    };
    const element = containerRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [story]);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 26));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 14));
  
  const formattedContent = useMemo(() => {
    if (!story.content) return "";
    return story.content
      .split("\n\n")
      .map(block => {
        const trimmed = block.trim();
        if (!trimmed) return "";

        if (/^<(h[1-6]|blockquote|ul|ol|li|div|p)/i.test(trimmed)) {
          return trimmed;
        }

        return `<p>${trimmed}</p>`;
      })
      .filter(Boolean)
      .join("\n");
  }, [story.content]);
  return (
    <div 
      className="glass-panel viewer-panel animate-fade-in" 
      id="story-viewer-container"
    >
      <div 
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          height: "4px",
          width: `${scrollProgress}%`,
          background: "linear-gradient(to right, var(--accent-secondary), var(--accent))",
          zIndex: 10,
          transition: "width 0.1s ease-out"
        }}
        id="scroll-progress-bar"
      />
      <div 
        className="viewer-control-bar"
        id="viewer-control-bar"
      >
        <button 
          onClick={onBack} 
          style={{ 
            padding: "8px 12px", 
            borderRadius: "10px",
            fontSize: "13px"
          }}
          id="back-to-list-btn"
        >
          ← <span className="back-btn-text">Kembali</span>
        </button>

        <div 
          style={{ 
            fontWeight: "700", 
            fontSize: "14px", 
            opacity: 0.8,
            maxWidth: "50%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "var(--font-main)"
          }}
          className="viewer-top-title"
        >
          {story.title}
        </div>
        <button
          onClick={onToggleFavorite}
          style={{
            background: "none",
            border: "none",
            padding: "8px",
            boxShadow: "none",
            fontSize: "18px",
            color: isFavorite ? "#ef4444" : "var(--text-muted)",
            cursor: "pointer",
            backdropFilter: "none",
            transform: "none",
            lineHeight: 1
          }}
          title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
          id="viewer-bookmark-btn"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
      <div 
        ref={containerRef}
        style={{ 
          padding: "36px 24px 24px 24px", 
          overflowY: "auto",
          flex: 1,
          scrollBehavior: "smooth"
        }}
        id="scrollable-story-content"
      >
        <div style={{ marginBottom: "32px", textAlign: "center" }} id="story-metadata-header">
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
            <span className={`category-badge ${story.category}`}>
              {story.category}
            </span>
            <span 
              style={{ 
                fontSize: "11px", 
                opacity: 0.7, 
                background: "var(--card-border)", 
                padding: "4px 10px", 
                borderRadius: "20px" 
              }}
            >
              ⏱️ Estimasi: {story.readingTime}
            </span>
          </div>
          <h1 
            className="font-main" 
            style={{ 
              fontSize: "32px", 
              fontWeight: "800",
              lineHeight: "1.25",
              marginBottom: "12px",
              color: "var(--text-primary)"
            }}
          >
            {story.title}
          </h1>
          <p 
            style={{ 
              fontSize: "14px", 
              opacity: 0.6, 
              fontStyle: "italic",
              marginBottom: "16px" 
            }}
          >
            Ditulis oleh {story.author}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            {story.tags.map(tag => (
              <span 
                key={tag} 
                style={{ 
                  fontSize: "11px", 
                  fontWeight: "600",
                  color: "var(--text-primary)", 
                  background: "var(--accent-light)",
                  padding: "2px 8px", 
                  borderRadius: "6px",
                  opacity: 0.9
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div 
          style={{ 
            fontFamily: fontFamily === "serif" ? "'Comic Relief', cursive" : "'Playfair Display', serif",
            fontSize: `${fontSize}px`,
            maxWidth: "640px",
            margin: "0 auto 36px auto",
            transition: "font-size 0.2s ease"
          }}
          id="narrative-paragraphs"
        >
          <div
            className={`story-html-content font-${fontFamily}`}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </div>
        <div 
          style={{ 
            borderTop: "1px solid var(--card-border)", 
            paddingTop: "24px", 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px"
          }}
          id="reader-footer-actions"
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "14px", opacity: 0.6, marginBottom: "4px" }}>
              {isCompleted ? "🎉 Anda telah menyelesaikan cerpen ini!" : "Selesai menyelami cerita ini?"}
            </p>
            <p style={{ fontSize: "11px", opacity: 0.4 }}>
              Status penyelesaian akan disimpan secara otomatis di perpustakaan Anda.
            </p>
          </div>
          <button
            onClick={onToggleCompleted}
            className={isCompleted ? "" : "primary"}
            style={{ 
              padding: "10px 24px", 
              borderRadius: "20px",
              fontSize: "14px"
            }}
            id="mark-completed-btn"
          >
            {isCompleted ? "✓ Selesai Dibaca" : "📖 Tandai Selesai Dibaca"}
          </button>
        </div>
      </div>
      <button 
        onClick={() => setIsPreferencesOpen(true)}
        className="fab-preferences animate-fade-in"
        title="Kustomisasi Tampilan"
        id="fab-preferences-trigger"
      >
        Aa
      </button>
      <div 
        className={`preferences-overlay ${isPreferencesOpen ? "active" : ""}`}
        onClick={() => setIsPreferencesOpen(false)}
        id="preferences-overlay"
      />
      <div 
        className={`preferences-drawer ${isPreferencesOpen ? "active" : ""}`}
        id="preferences-drawer-panel"
      >
        <div className="drawer-handle" onClick={() => setIsPreferencesOpen(false)} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 className="font-main" style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.2px" }}>Kustomisasi Membaca</h3>
          <button 
            onClick={() => setIsPreferencesOpen(false)}
            style={{ background: "none", border: "none", boxShadow: "none", fontSize: "14px", padding: "4px", cursor: "pointer", color: "var(--text-primary)" }}
          >
            ✕
          </button>
        </div>
        <div className="drawer-section">
          <div className="drawer-section-title">🔤 Jenis Huruf</div>
          <div className="drawer-grid">
            <button
              onClick={() => setFontFamily("serif")}
              style={{
                background: fontFamily === "serif" ? "var(--accent-light)" : "var(--card-bg)",
                borderColor: fontFamily === "serif" ? "var(--accent)" : "var(--card-border)",
                color: fontFamily === "serif" ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: fontFamily === "serif" ? "600" : "500",
                fontFamily: "'Comic Relief', cursive",
                fontSize: "14px",
                width: "100%",
                padding: "10px"
              }}
            >
              Comic Relief
            </button>
            <button
              onClick={() => setFontFamily("sans-serif")}
              style={{
                background: fontFamily === "sans-serif" ? "var(--accent-light)" : "var(--card-bg)",
                borderColor: fontFamily === "sans-serif" ? "var(--accent)" : "var(--card-border)",
                color: fontFamily === "sans-serif" ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: fontFamily === "sans-serif" ? "600" : "500",
                fontFamily: "var(--font-main)",
                fontSize: "13px",
                width: "100%",
                padding: "10px"
              }}
            >
              Playfair (Sans)
            </button>
          </div>
        </div>
        <div className="drawer-section">
          <div className="drawer-section-title">📏 Ukuran Huruf</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--card-bg)", padding: "4px 8px", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 14}
              style={{ 
                padding: "8px 16px", 
                opacity: fontSize <= 14 ? 0.4 : 1,
                fontSize: "15px",
                background: "none",
                border: "none",
                boxShadow: "none",
                cursor: fontSize <= 14 ? "default" : "pointer",
                color: "var(--text-primary)"
              }}
            >
              A-
            </button>
            <span style={{ fontSize: "14px", fontWeight: "700" }}>
              {fontSize} px
            </span>
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 26}
              style={{ 
                padding: "8px 16px", 
                opacity: fontSize >= 26 ? 0.4 : 1,
                fontSize: "15px",
                background: "none",
                border: "none",
                boxShadow: "none",
                cursor: fontSize >= 26 ? "default" : "pointer",
                color: "var(--text-primary)"
              }}
            >
              A+
            </button>
          </div>
        </div>
        <div className="drawer-section">
          <div className="drawer-section-title">🎨 Warna Tema</div>
          <div className="drawer-grid-3">
            <button
              onClick={() => setTheme("midnight")}
              style={{
                background: theme === "midnight" ? "var(--accent-light)" : "var(--card-bg)",
                borderColor: theme === "midnight" ? "var(--accent)" : "var(--card-border)",
                color: theme === "midnight" ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "12px",
                flexDirection: "column",
                gap: "6px",
                padding: "12px 0",
                width: "100%"
              }}
            >
              <span style={{ fontSize: "16px" }}>🌌</span>
              <span style={{ fontWeight: theme === "midnight" ? "600" : "400" }}>Gelap</span>
            </button>
            <button
              onClick={() => setTheme("sepia")}
              style={{
                background: theme === "sepia" ? "var(--accent-light)" : "var(--card-bg)",
                borderColor: theme === "sepia" ? "var(--accent)" : "var(--card-border)",
                color: theme === "sepia" ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "12px",
                flexDirection: "column",
                gap: "6px",
                padding: "12px 0",
                width: "100%"
              }}
            >
              <span style={{ fontSize: "16px" }}>📜</span>
              <span style={{ fontWeight: theme === "sepia" ? "600" : "400" }}>Sepia</span>
            </button>
            <button
              onClick={() => setTheme("light")}
              style={{
                background: theme === "light" ? "var(--accent-light)" : "var(--card-bg)",
                borderColor: theme === "light" ? "var(--accent)" : "var(--card-border)",
                color: theme === "light" ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "12px",
                flexDirection: "column",
                gap: "6px",
                padding: "12px 0",
                width: "100%"
              }}
            >
              <span style={{ fontSize: "16px" }}>☀️</span>
              <span style={{ fontWeight: theme === "light" ? "600" : "400" }}>Terang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryViewer;