import { useContactMessages } from "@/hooks/useSiteContent";

const DashboardHome = () => {
  const { data: messages } = useContactMessages();

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Contact Messages</p>
          <p className="text-3xl font-bold text-heading mt-2">{messages?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
