
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Target, 
  Award,
  BarChart3,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  completedMissions: number;
  avgResponseTime: number;
  successRate: number;
  topCategories: Array<{ name: string; count: number; revenue: number }>;
  monthlyTrends: Array<{ month: string; revenue: number; missions: number }>;
  clientSatisfaction: number;
  repeatClientRate: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  userType: 'client' | 'provider';
}

export function AnalyticsDashboard({ data, userType }: AnalyticsDashboardProps) {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      notation: amount > 10000 ? 'compact' : 'standard'
    }).format(amount);

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend && (
                <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                  {subtitle}
                </Badge>
              )}
            </div>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          title={userType === 'provider' ? 'Chiffre d\'affaires' : 'Budget dépensé'}
          value={formatCurrency(data.totalRevenue)}
          subtitle="+12%"
          trend="up"
        />
        <MetricCard
          icon={Target}
          title="Missions réussies"
          value={data.completedMissions}
          subtitle="+8%"
          trend="up"
        />
        <MetricCard
          icon={Clock}
          title="Temps de réponse moyen"
          value={`${data.avgResponseTime}h`}
          subtitle="-15%"
          trend="up"
        />
        <MetricCard
          icon={Award}
          title="Taux de réussite"
          value={`${data.successRate}%`}
          subtitle="+3%"
          trend="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top catégories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Top Catégories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topCategories.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{formatCurrency(category.revenue)}</span>
                      </div>
                      <Progress 
                        value={(category.revenue / data.topCategories[0].revenue) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.count} missions</span>
                        <span>#{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Satisfaction client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Satisfaction Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Note moyenne</span>
                      <span className="font-bold">{data.clientSatisfaction}/5</span>
                    </div>
                    <Progress value={data.clientSatisfaction * 20} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Clients fidèles</span>
                      <span className="font-bold">{data.repeatClientRate}%</span>
                    </div>
                    <Progress value={data.repeatClientRate} className="h-3" />
                  </div>

                  <div className="pt-4 border-t">
                    <Badge variant="outline" className="mr-2">⭐ 98% recommandent</Badge>
                    <Badge variant="outline">🔄 85% reviennent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {data.monthlyTrends.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(month.revenue / Math.max(...data.monthlyTrends.map(m => m.revenue))) * 200}px` }}
                      />
                      <span className="text-xs mt-2 text-center">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Cette semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nouvelles missions</span>
                    <Badge>+12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Messages reçus</span>
                    <Badge>+47</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Offres soumises</span>
                    <Badge>+8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Projets terminés</span>
                    <Badge>+3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des tendances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Croissance</h4>
                  <p className="text-2xl font-bold text-blue-600">+25%</p>
                  <p className="text-sm text-muted-foreground">vs mois dernier</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Nouveaux clients</h4>
                  <p className="text-2xl font-bold text-green-600">34</p>
                  <p className="text-sm text-muted-foreground">ce mois</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold">Note moyenne</h4>
                  <p className="text-2xl font-bold text-purple-600">4.9</p>
                  <p className="text-sm text-muted-foreground">sur 5 étoiles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Répartition géographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { region: 'Île-de-France', missions: 45, revenue: 25000 },
                  { region: 'Rhône-Alpes', missions: 23, revenue: 15000 },
                  { region: 'PACA', missions: 18, revenue: 12000 },
                  { region: 'Occitanie', missions: 15, revenue: 8000 }
                ].map(region => (
                  <div key={region.region} className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold">{region.region}</h4>
                    <p className="text-lg font-bold text-primary">{region.missions}</p>
                    <p className="text-xs text-muted-foreground">missions</p>
                    <p className="text-sm font-medium">{formatCurrency(region.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
