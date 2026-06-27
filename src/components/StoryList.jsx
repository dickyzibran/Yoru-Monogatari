import { useMemo, useState } from "react";

function StoryList({ 
  stories, 
  selectedStory, 
  onSelect, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  favorites,
  completed,
  toggleFavorite
}) {

  const [activeTab, setActiveTab] = useState("all"); // 'all', 'completed', 'favorites'

  const categories = useMemo(() => {
    return ["Semua", "Slice of Life", "Romance", "Fantasi", "Horror", "Thriller", "Drama", "Adventure", "Action", "Sci-Fi", "Komedi"];
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {

      if (activeTab === "completed" && !completed.includes(story.id)) {
        return false;
      }
      if (activeTab === "favorites" && !favorites.includes(story.id)) {
        return false;
      }


      const matchesCategory = selectedCategory === "Semua" || story.category === selectedCategory;


      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [stories, selectedCategory, searchQuery, activeTab, completed, favorites]);
  return (
    <div id="story-list-component">
      <h2 
        className="font-main story-list-title" 
        id="story-list-title"
      >
        Karya Cerpen Pilihan Terbaik
      </h2>
      <div className="dashboard-stats-row" id="library-dashboard-stats">
        <div 
          className={`stat-card ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
          style={{ cursor: "pointer" }}
        >
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <span className="stat-value">{stories.length}</span>
            <span className="stat-label">Koleksi</span>
          </div>
        </div>
        <div 
          className={`stat-card ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
          style={{ cursor: "pointer" }}
        >
          <span className="stat-icon" style={{ color: "var(--accent)" }}>✓</span>
          <div className="stat-info">
            <span className="stat-value">{completed.length}</span>
            <span className="stat-label">Selesai</span>
          </div>
        </div>
        <div 
          className={`stat-card ${activeTab === "favorites" ? "active" : ""} favorites-card`}
          onClick={() => setActiveTab("favorites")}
          style={{ cursor: "pointer" }}
        >
          <span className="stat-icon" style={{ color: "#ef4444" }}>❤️</span>
          <div className="stat-info">
            <span className="stat-value">{favorites.length}</span>
            <span className="stat-label">Favorit</span>
          </div>
        </div>
      </div>
      <div className="sidebar-filter-area" id="sidebar-filter-area">
        <div 
          style={{ 
            position: "relative", 
            marginBottom: "20px",
            width: "100%"
          }}
          id="search-container"
        >
          <span 
            style={{ 
              position: "absolute", 
              left: "14px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              opacity: 0.5,
              fontSize: "16px"
            }}
          >
            🔍
          </span>
          <input 
            type="text" 
            placeholder="Cari judul, penulis, tag, atau isi cerita..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              fontSize: "14px",
              borderRadius: "14px",
              border: "1px solid var(--card-border)",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              outline: "none",
              backdropFilter: "blur(var(--glass-blur))",
              boxShadow: "inset 0 2px 4px var(--shadow-color)",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 10px var(--accent-light)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--card-border)";
              e.target.style.boxShadow = "inset 0 2px 4px var(--shadow-color)";
            }}
            id="search-input-field"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: "4px 8px",
                boxShadow: "none",
                cursor: "pointer",
                opacity: 0.6,
                color: "var(--text-primary)",
                backdropFilter: "none"
              }}
              id="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>
        <div className="category-scroll-container">
          <div 
            style={{ 
              display: "flex", 
              gap: "8px", 
              overflowX: "auto", 
              paddingBottom: "12px", 
              scrollbarWidth: "none", /* Firefox */
              width: "100%",
              maxWidth: "100%"
            }}
            id="category-tabs"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  background: selectedCategory === cat ? "var(--accent)" : "var(--card-bg)",
                  color: selectedCategory === cat ? "#ffffff" : "var(--text-secondary)",
                  borderColor: selectedCategory === cat ? "var(--accent)" : "var(--card-border)",
                  boxShadow: selectedCategory === cat ? "0 4px 10px var(--accent-light)" : "0 2px 4px var(--shadow-color)",
                  transform: "none",
                  transition: "all 0.2s ease"
                }}
                id={`category-tab-${cat}`}
              >
                {cat === "Semua" ? "Semua" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "16px" 
        }} 
        id="story-cards-wrapper"
      >
        {filteredStories.length > 0 ? (
          filteredStories.map(story => {
            const isSelected = selectedStory?.id === story.id;
            const isFav = favorites.includes(story.id);
            const isDone = completed.includes(story.id);
            
            return (
              <div
                key={story.id}
                onClick={() => onSelect(story)}
                className={`glass-panel animate-fade-in story-card`}
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  border: isSelected ? "1.5px solid var(--accent)" : "1.5px solid var(--card-border)",
                  background: isSelected ? "var(--accent-light)" : "var(--card-bg)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transform: "translateY(0)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 12px 24px var(--shadow-color)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = isSelected ? "var(--accent)" : "var(--card-border)";
                  e.currentTarget.style.boxShadow = "0 20px 40px var(--shadow-color)";
                }}
                id={`story-card-${story.id}`}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div>
                    <h3 
                      className="font-main" 
                      style={{ 
                        fontSize: "18px", 
                        fontWeight: "700", 
                        lineHeight: "1.3",
                        color: "var(--text-primary)"
                      }}
                    >
                      {story.title}
                    </h3>
                    <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "2px" }}>
                      oleh {story.author}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop navigation to reading mode
                      toggleFavorite(story.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "6px",
                      boxShadow: "none",
                      transform: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: isFav ? "#ef4444" : "var(--text-muted)",
                      backdropFilter: "none",
                      lineHeight: 1
                    }}
                    title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                    id={`heart-btn-${story.id}`}
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>
                </div>
                <p 
                  style={{ 
                    fontSize: "13px", 
                    color: "var(--text-secondary)", 
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {story.description}
                </p>
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginTop: "4px",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    
                    <span className={`category-badge ${story.category}`}>
                      {story.category}
                    </span>
                    <span style={{ fontSize: "11px", opacity: 0.6, display: "flex", alignItems: "center", gap: "4px" }}>
                      ⏱️ {story.readingTime}
                    </span>
                    {isDone && (
                      <span 
                        style={{ 
                          fontSize: "11px", 
                          color: "var(--accent)", 
                          background: "var(--accent-light)", 
                          padding: "2px 8px", 
                          borderRadius: "10px", 
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        ✓ Selesai
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {story.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag} 
                        style={{ 
                          fontSize: "10px", 
                          opacity: 0.5, 
                          border: "1px solid var(--card-border)", 
                          padding: "2px 6px",
                          borderRadius: "4px"
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div 
            style={{ 
              padding: "40px 20px", 
              textAlign: "center", 
              border: "1px dashed var(--card-border)", 
              borderRadius: "16px",
              opacity: 0.7
            }}
            id="search-empty-state"
          >
            <p style={{ fontSize: "14px", marginBottom: "4px" }}>🔍 Tidak ada cerpen ditemukan</p>
            <p style={{ fontSize: "12px", opacity: 0.6 }}>Cobalah kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryList;