import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Globe, Server, Users, DollarSign, ShoppingCart } from "lucide-react"

const stats = [
  {
    title: "Active Hosting Packages",
    value: "24",
    description: "3 new this month",
    icon: Package,
  },
  {
    title: "Managed TLDs",
    value: "156",
    description: "12 registrars connected",
    icon: Globe,
  },
  {
    title: "Active Servers",
    value: "8",
    description: "All systems operational",
    icon: Server,
  },
  {
    title: "Total Customers",
    value: "1,247",
    description: "+12% from last month",
    icon: Users,
  },
  {
    title: "Monthly Revenue",
    value: "$24,580",
    description: "+8% from last month",
    icon: DollarSign,
  },
  {
    title: "Pending Orders",
    value: "18",
    description: "5 require attention",
    icon: ShoppingCart,
  },
]

export  function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your hosting business operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your hosting panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New hosting package created</p>
                  <p className="text-xs text-muted-foreground">Premium SSD - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">TLD pricing updated</p>
                  <p className="text-xs text-muted-foreground">.com domain - 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Server maintenance completed</p>
                  <p className="text-xs text-muted-foreground">Server-01 - 1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center justify-start p-3 text-sm bg-accent hover:bg-accent/80 rounded-md transition-colors">
                <Package className="mr-2 h-4 w-4" />
                Create New Hosting Package
              </button>
              <button className="flex items-center justify-start p-3 text-sm bg-accent hover:bg-accent/80 rounded-md transition-colors">
                <Globe className="mr-2 h-4 w-4" />
                Add New TLD
              </button>
              <button className="flex items-center justify-start p-3 text-sm bg-accent hover:bg-accent/80 rounded-md transition-colors">
                <Server className="mr-2 h-4 w-4" />
                Monitor Server Status
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
