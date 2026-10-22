import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  getArtikel,
  getKategori,
} from "../services/identifikasiServices";

import { Identifikasi } from "../types/identifikasi";

export default function useIdentifikasi() {

  const [kategori, setKategori] =
    useState<string[]>([]);

  const [selectedKategori,
    setSelectedKategori] =
    useState("Semua");

  const [artikel, setArtikel] =
    useState<Identifikasi[]>([]);

  const [keyword, setKeyword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchKategori();
    fetchArtikel("Semua", "");
  }, []);

  const fetchKategori =
    async () => {
      const data =
        await getKategori();

      setKategori(data);
    };

  const fetchArtikel =
    useCallback(
      async (
        kat: string,
        kw: string
      ) => {

        setLoading(true);

        const data =
          await getArtikel(
            kat,
            kw
          );

        setArtikel(data);

        setLoading(false);

      },
      []
    );

  const pilihKategori =
    (kat: string) => {

      setSelectedKategori(kat);

      fetchArtikel(
        kat,
        keyword
      );
    };

  const handleSearch =
    () =>
      fetchArtikel(
        selectedKategori,
        keyword
      );

  return {
    kategori,
    artikel,
    loading,

    keyword,
    setKeyword,

    selectedKategori,
    pilihKategori,

    handleSearch,
  };
}