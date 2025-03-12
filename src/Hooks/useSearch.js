import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useSearch = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search);
    navigate(`/search?query=${search}`);
  };

  return { search, setSearch, handleSubmit };
};

export default useSearch;
    