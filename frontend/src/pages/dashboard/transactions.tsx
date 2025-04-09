import DashboardLayout from "@/layouts/DashboardLayout";

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-gray-600 text-2xl font-bold">Transactions</h1>
        <p className="text-gray-600">
          Here you can view and manage your transactions.
        </p>
      </div>
    </DashboardLayout>
  );
}
