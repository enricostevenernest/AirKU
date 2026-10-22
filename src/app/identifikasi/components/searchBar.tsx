import { Search } from "lucide-react";

type Props = {
  keyword: string;
  setKeyword: (v: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  keyword,
  setKeyword,
  onSearch,
}: Props) {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search size={22} />

        <input
          type="text"
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          placeholder="Cari artikel masalah air..."
          className="search-input"
        />
      </div>

      <button
        className="search-button"
        onClick={onSearch}
      >
        <Search size={18} />
        Cari
      </button>
    </div>
  );
}