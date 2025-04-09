import DashboardLayout from "@/layouts/DashboardLayout";

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-gray-600 text-3xl font-bold mb-2">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600">
          Choose a section from the sidebar to get started.
        </p>
      </div>
    </DashboardLayout>
  );
}
