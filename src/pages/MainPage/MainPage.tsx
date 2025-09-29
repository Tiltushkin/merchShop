import s from "./MainPage.module.scss";
import MainLayout from "../../layouts/MainLayout";
import { useEffect, useMemo, useState } from "react";
import { mugs } from "../../mockData/products/mugs";
import { posters } from "../../mockData/products/posters";
import { tShirts } from "../../mockData/products/tShirts";
import type { Product } from "../../shared/types/types";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import utils from "../../utils/utils.ts";

const CATEGORIES = [
    { id: 1, key: "mugs", title: "Кружки" },
    { id: 2, key: "posters", title: "Постеры" },
    { id: 3, key: "tshirts", title: "Футболки" },
];

const PAGE_SIZES = [6, 9, 12];

const MainPage = () => {
    const [productCategory, setProductCategory] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState<string>("");
    const [minCost, setMinCost] = useState<number | "">("");
    const [maxCost, setMaxCost] = useState<number | "">("");
    const [sortBy, setSortBy] = useState<string>("default");
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [selected, setSelected] = useState<Product | null>(null);

    useEffect(() => {
        setPage(1);
        switch (productCategory) {
            case 1: setProducts(mugs); break;
            case 2: setProducts(posters); break;
            case 3: setProducts(tShirts); break;
            default: setProducts([]); break;
        }
    }, [productCategory]);

    const filtered = useMemo(() => {
        let list = products.slice();
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(q));
        }
        if (minCost !== "") list = list.filter(p => utils.calcWithDiscount(p.cost, p.discount) >= Number(minCost));
        if (maxCost !== "") list = list.filter(p => utils.calcWithDiscount(p.cost, p.discount) <= Number(maxCost));
        if (sortBy === "price-asc") list.sort((a,b) => utils.calcWithDiscount(a.cost, a.discount) - utils.calcWithDiscount(b.cost, b.discount));
        if (sortBy === "price-desc") list.sort((a,b) => utils.calcWithDiscount(b.cost, b.discount) - utils.calcWithDiscount(a.cost, a.discount));
        if (sortBy === "name") list.sort((a,b) => a.name.localeCompare(b.name));
        return list;
    }, [products, search, minCost, maxCost, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageProducts = filtered.slice((page-1)*pageSize, page*pageSize);

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    return (
        <MainLayout>
            <div className={s.wrapper}>
                <div className={s.headerRow}>
                    <div className={s.categories}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`${s.catBtn} ${productCategory === cat.id ? s.active : ""}`}
                                onClick={() => setProductCategory(cat.id)}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>

                    <div className={s.controls}>
                        <input className={s.search} placeholder="Поиск по товарам..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={s.select}>
                            <option value="default">Сортировать</option>
                            <option value="price-asc">Цена ↑</option>
                            <option value="price-desc">Цена ↓</option>
                            <option value="name">Название</option>
                        </select>
                    </div>
                </div>

                <div className={s.filtersRow}>
                    <div className={s.range}>
                        <input placeholder="Мин" type="number" value={minCost === "" ? "" : minCost} onChange={e => { setMinCost(e.target.value === "" ? "" : Number(e.target.value)); setPage(1); }} />
                        <input placeholder="Макс" type="number" value={maxCost === "" ? "" : maxCost} onChange={e => { setMaxCost(e.target.value === "" ? "" : Number(e.target.value)); setPage(1); }} />
                    </div>

                    <div className={s.pagerControls}>
                        <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className={s.select}>
                            {PAGE_SIZES.map(v => <option key={v} value={v}>{v} на странице</option>)}
                        </select>
                        <div className={s.count}>Найдено: <strong>{filtered.length}</strong></div>
                    </div>
                </div>

                <section className={s.grid}>
                    {pageProducts.length === 0 && <div className={s.empty}>Ничего не найдено</div>}
                    {pageProducts.map(p => (productCategory == 2 || productCategory == 3) ? <ProductCard key={p.id} product={p} onOpen={setSelected} cardType={2} /> : <ProductCard key={p.id} product={p} onOpen={setSelected} />)}
                </section>

                <div className={s.pagination}>
                    <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
                    <span className={s.pageInfo}>{page} / {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>›</button>
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
                </div>
            </div>

            <ProductModal product={selected} onClose={() => setSelected(null)} />
        </MainLayout>
    );
};

export default MainPage;