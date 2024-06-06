import db from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/formatters";

async function getProductsData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    totalSales: data._sum.pricePaidInCents || 0,
    totalOrders: data._count || 0,
  };
}

export default async function DashboardPage() {
  const salesData = await getProductsData();
  return (
    <div className="container my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.totalSales)} Ordres`}
        body={formatCurrency(salesData?.totalOrders)}
      />
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(salesData.totalSales)} Products`}
        body={formatCurrency(salesData?.totalOrders)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatNumber(salesData.totalSales)} Customers`}
        body={formatCurrency(salesData?.totalOrders)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};
export const DashboardCard = ({
  title,
  subtitle,
  body,
}: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
};
