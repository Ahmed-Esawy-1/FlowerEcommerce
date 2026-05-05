import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative overflow-hidden aspect-[4/5] mb-4 group">
        <img
          src={product.imgPath}
          alt={product.imgAlt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between gap-1">
          <h3 className="text-sm group-hover:text-primary transition-colors flex-1">
            {product.title}
          </h3>
          <span className="text-right">EGP {product.price}</span>
        </div>
        <p className="line-camp-1 text-[12px] text-slate-400">{product.body}</p>
      </div>
    </Link>
  );
}
