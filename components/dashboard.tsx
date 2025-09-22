import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Globe, Server, Mail, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Zap } from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-8 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2,847</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-600 font-medium">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Active Domains</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1,234</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-600 font-medium">+8% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Server Uptime</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Server className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">99.9%</div>
            <div className="flex items-center mt-2">
              <Activity className="h-4 w-4 text-purple-500 mr-1" />
              <p className="text-sm text-purple-600 font-medium">Last 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Email Accounts</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">5,678</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-600 font-medium">+15% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest user and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">New user registration</p>
                  <p className="text-sm text-gray-600">john.doe@example.com</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <Globe className="h-6 w-6 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Domain renewal</p>
                  <p className="text-sm text-gray-600">example.com</p>
                  <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Server maintenance scheduled</p>
                  <p className="text-sm text-gray-600">Server-03</p>
                  <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <Mail className="h-6 w-6 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Email account created</p>
                  <p className="text-sm text-gray-600">support@newdomain.com</p>
                  <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              System Status
            </CardTitle>
            <CardDescription>Current status of all services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <Server className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Web Servers</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <Globe className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">DNS Services</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Email Services</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">Backup Systems</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">
                  Maintenance
                </Badge>
              </div>
            </div>

            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-medium">
              View Detailed Status
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-24 flex flex-col space-y-3 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg">
              <Users className="h-7 w-7" />
              <span className="font-medium">Add User</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col space-y-3 hover:bg-green-50 hover:border-green-300 hover:scale-105 transition-all duration-200 shadow-lg bg-transparent"
            >
              <Globe className="h-7 w-7 text-green-600" />
              <span className="font-medium text-green-700">Register Domain</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col space-y-3 hover:bg-purple-50 hover:border-purple-300 hover:scale-105 transition-all duration-200 shadow-lg bg-transparent"
            >
              <Server className="h-7 w-7 text-purple-600" />
              <span className="font-medium text-purple-700">Deploy Service</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col space-y-3 hover:bg-orange-50 hover:border-orange-300 hover:scale-105 transition-all duration-200 shadow-lg bg-transparent"
            >
              <Mail className="h-7 w-7 text-orange-600" />
              <span className="font-medium text-orange-700">Create Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
