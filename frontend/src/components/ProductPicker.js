import React, { useEffect, useState, useRef } from 'react';

export default function ProductPicker({
  initialName = '',
  initialId = null,
  onChange,
  placeholder = 'Product name...',
  products: initialProducts = null,
}) {
  const [input, setInput] = useState(initialName);
  const [products, setProducts] = useState(initialProducts ?? []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (initialProducts !== null && initialProducts !== undefined) {
      setProducts(initialProducts);
      return;
    }

    let mounted = true;
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/products/', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [initialProducts]);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const filtered = products.filter(p => {
    const name = (p && (p.name ?? p.title ?? p.label ?? '')).toString();
    return name.toLowerCase().includes((input || '').toLowerCase());
  });

  function selectProduct(p) {
    const name = (p && (p.name ?? p.title ?? p.label ?? '')).toString();
    setInput(name);
    setOpen(false);
    if (onChange) onChange({ id: p?.id ?? null, name });
  }

  function onInputChange(e) {
    const v = e.target.value;
    setInput(v);
    setOpen(true);
    if (onChange) onChange({ id: null, name: v });
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={onInputChange}
        onFocus={() => setOpen(true)}
        className="product-picker-input"
        autoComplete="off"
      />
      {open && (
        <div className="product-picker-dropdown" style={{
          position: 'absolute', zIndex: 50, left: 0, right: 0,
          maxHeight: 240, overflowY: 'auto', background: '#fff', border: '1px solid #ccc'
        }}>
          {loading && <div style={{ padding: 8 }}>Loading…</div>}
          {!loading && filtered.length === 0 && <div style={{ padding: 8 }}>No products</div>}
          {!loading && filtered.map(p => {
            const name = (p && (p.name ?? p.title ?? p.label ?? '')).toString();
            return (
              <div
                key={p?.id ?? name}
                onClick={() => selectProduct(p)}
                style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid #eee' }}
              >
                {name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}