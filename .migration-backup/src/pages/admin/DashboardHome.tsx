import { useContactMessages, useProjects, useBlogPosts, useServices, useTestimonials } from "@/hooks/useSiteContent";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MessageSquare, Briefcase, FileText, Layers, Users } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--muted))", "hsl(var(--destructive))"];

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <div className="glass rounded-xl p-6 flex items-center gap-4">
    <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-heading mt-1">{value}</p>
    </div>
  </div>
);

const DashboardHome = () => {
  const { data: messages = [] } = useContactMessages();
  const { data: projects = [] } = useProjects();
  const { data: posts = [] } = useBlogPosts(true);
  const { data: services = [] } = useServices();
  const { data: testimonials = [] } = useTestimonials();

  const barData = [
    { name: "Projects", count: projects.length },
    { name: "Services", count: services.length },
    { name: "Blog Posts", count: posts.length },
    { name: "Messages", count: messages.length },
    { name: "Reviews", count: testimonials.length },
  ];

  const publishedPosts = posts.filter((p: any) => p.is_published).length;
  const draftPosts = posts.length - publishedPosts;
  const pieData = [
    { name: "Published", value: publishedPosts },
    { name: "Draft", value: draftPosts },
  ].filter(d => d.value > 0);

  const categoryMap: Record<string, number> = {};
  projects.forEach((p: any) => {
    const cat = p.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard icon={MessageSquare} label="Messages" value={messages.length} color="hsl(var(--primary))" />
        <StatCard icon={Briefcase} label="Projects" value={projects.length} color="hsl(var(--accent))" />
        <StatCard icon={FileText} label="Blog Posts" value={posts.length} color="hsl(var(--secondary))" />
        <StatCard icon={Layers} label="Services" value={services.length} color="hsl(var(--muted-foreground))" />
        <StatCard icon={Users} label="Reviews" value={testimonials.length} color="hsl(var(--destructive))" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-heading mb-4">Content Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Blog Status */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Blog Status</h2>
            <div className="h-48">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No blog posts yet</div>
              )}
            </div>
          </div>

          {/* Project Categories */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">Project Categories</h2>
            <div className="h-48">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No projects yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
