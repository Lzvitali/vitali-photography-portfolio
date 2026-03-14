import { getPortfolioData } from "@/lib/data";
import AdminCategoryClient from "./AdminCategoryClient";

export async function generateStaticParams() {
  const portfolio = getPortfolioData();
  return portfolio.categories.map((cat) => ({
    category: cat.slug,
  }));
}

interface AdminCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function AdminCategoryPage({ params }: AdminCategoryPageProps) {
  const { category: slug } = await params;
  return <AdminCategoryClient slug={slug} />;
}
