// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
// @ts-ignore;
import { MapPin, Navigation, Clock } from 'lucide-react';

export function DistanceCalculator({
  fromLocation,
  toLocation,
  className = ''
}) {
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (fromLocation && toLocation) {
      calculateDistance();
    }
  }, [fromLocation, toLocation]);
  const calculateDistance = () => {
    if (!window.AMap) return;
    setLoading(true);
    // 使用高德地图距离计算
    const driving = new window.AMap.Driving({
      policy: window.AMap.DrivingPolicy.LEAST_TIME
    });
    driving.search([fromLocation.lng, fromLocation.lat], [toLocation.lng, toLocation.lat], (status, result) => {
      setLoading(false);
      if (status === 'complete' && result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        setDistanceInfo({
          distance: (route.distance / 1000).toFixed(1),
          // 公里
          duration: Math.round(route.time / 60),
          // 分钟
          tolls: route.tolls || 0
        });
      } else {
        // 如果路径规划失败，使用直线距离
        const lineDistance = window.AMap.GeometryUtil.distance([fromLocation.lng, fromLocation.lat], [toLocation.lng, toLocation.lat]);
        setDistanceInfo({
          distance: (lineDistance / 1000).toFixed(1),
          duration: Math.round(lineDistance / 1000 * 3),
          // 估算时间：3分钟/公里
          tolls: 0
        });
      }
    });
  };
  const getDistanceColor = distance => {
    if (distance < 5) return 'text-green-600';
    if (distance < 15) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getDurationColor = duration => {
    if (duration < 30) return 'text-green-600';
    if (duration < 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  if (!fromLocation || !toLocation) {
    return null;
  }
  return <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Navigation className="mr-2" size={16} />
          距离信息
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <div className="text-center py-4">
            <div className="text-gray-500">计算中...</div>
          </div> : distanceInfo && <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">行驶距离</span>
              <Badge className={getDistanceColor(distanceInfo.distance)}>
                {distanceInfo.distance}公里
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">预计时间</span>
              <Badge className={getDurationColor(distanceInfo.duration)}>
                <Clock className="mr-1" size={12} />
                {distanceInfo.duration}分钟
              </Badge>
            </div>
            {distanceInfo.tolls > 0 && <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">过路费</span>
                <span className="text-sm font-semibold">¥{distanceInfo.tolls}</span>
              </div>}
            <div className="text-xs text-gray-500 mt-2">
              <p>• 基于实时路况计算，仅供参考</p>
              <p>• 实际时间可能因交通状况变化</p>
            </div>
          </div>}
      </CardContent>
    </Card>;
}