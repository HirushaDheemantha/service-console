"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Globe,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useData } from "@/lib/data-context";

export function OverviewTab() {
  const { services, clients } = useData();

  // Debug: log active domains
  console.log(
    "Active domains:",
    services.filter((s) => s.type === "domain" && s.status === "running")
  );

  const stats = {
    totalServices: services.length,
    activeServices: services.filter(
      (s) =>
        (s.status as string) === "running" || (s.status as string) === "active"
    ).length,
    totalDomains: services.filter((s) => s.type === "domain").length,
    activeDomains: services.filter(
      (s) =>
        s.type === "domain" &&
        ((s.status as string) === "running" ||
          (s.status as string) === "active")
    ).length,
    totalClients: clients.length,
    totalRevenue: services.reduce((sum, s) => sum + s.purchasePrice, 0),
    monthlyRevenue: services.reduce((sum, s) => sum + s.renewalPrice, 0),
  };

  // Show only services with renewalDate or nextRenewal within the next 3 months
  const now = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(now.getMonth() + 3);
  const upcomingRenewals = services
    .filter((s) => {
      const status = s.status as string;
      if (!(status === "running" || status === "active")) return false;
      // Prefer nextRenewal, fallback to renewalDate
      const renewalStr = s.nextRenewal || s.renewalDate;
      if (!renewalStr) return false;
      const renewal = new Date(renewalStr);
      return renewal >= now && renewal <= threeMonthsFromNow;
    })
    .sort((a, b) => {
      const aDate = new Date(a.nextRenewal || a.renewalDate);
      const bDate = new Date(b.nextRenewal || b.renewalDate);
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, 5);

  const recentClients = clients.slice(-3).reverse();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeServices} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Domains
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDomains}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalDomains} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">Renewal revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Renewals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Renewals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingRenewals.length > 0 ? (
              <div className="space-y-3">
                {upcomingRenewals.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {service.type === "hosting" ? (
                        <Server className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(service.renewalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">${service.renewalPrice}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No upcoming renewals</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Clients</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentClients.length > 0 ? (
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-gray-600">{client.email}</p>
                      <p className="text-xs text-gray-600">{client.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No recent clients</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Revenue Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalRevenue}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ${stats.monthlyRevenue}
              </p>
              <p className="text-sm text-gray-600">Monthly Renewals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                $
                {stats.totalRevenue > 0
                  ? ((stats.monthlyRevenue / stats.totalRevenue) * 100).toFixed(
                      1
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-600">Renewal Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
