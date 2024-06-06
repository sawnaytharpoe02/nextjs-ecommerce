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

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    totalSales: data._sum.pricePaidInCents || 0,
    totalOrders: data._count || 0,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ _sum: { pricePaidInCents: true } }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

async function getProductsData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeCount, inactiveCount };
}

export default async function DashboardPage() {
  const [salesData, usersData, productsData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductsData(),
  ]);

  return (
    <div className="container my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.totalSales)} Ordres`}
        body={formatCurrency(salesData.totalOrders)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatNumber(
          usersData.averageValuePerUser
        )} Average Value`}
        body={`${formatCurrency(usersData.userCount)}`}
      />
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(productsData.inactiveCount)} Inactive`}
        body={formatNumber(productsData.activeCount)}
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
