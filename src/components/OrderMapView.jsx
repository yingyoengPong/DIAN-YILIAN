// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { MapPin, Navigation, Car } from 'lucide-react';

export function OrderMapView({
  order,
  userLocation,
  className = ''
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (!order || !order.location) return;
    const loadAMap = () => {
      if (window.AMap) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=aa5927454d6839e16fc2da4b741ca2aa&plugin=AMap.Driving`;
      script.onload = initMap;
      document.head.appendChild(script);
    };
    const initMap = () => {
      if (!mapRef.current) return;
      try {
        mapInstance.current = new window.AMap.Map(mapRef.current, {
          zoom: 13,
          center: [order.location.lng, order.location.lat],
          viewMode: '2D'
        });
        // 添加订单位置标记
        addOrderMarker();
        // 如果用户有位置，添加用户位置标记
        if (userLocation) {
          addUserMarker();
        }
        setMapLoaded(true);
      } catch (error) {
        toast({
          title: '地图加载失败',
          description: error.message,
          variant: 'destructive'
        });
      }
    };
    const addOrderMarker = () => {
      const orderMarker = new window.AMap.Marker({
        position: [order.location.lng, order.location.lat],
        map: mapInstance.current,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/red.png',
        title: order.address
      });
      markersRef.current.push(orderMarker);
      // 添加信息窗口
      const infoWindow = new window.AMap.InfoWindow({
        content: `<div class="p-2">
            <div class="font-semibold">${order.title}</div>
            <div class="text-sm text-gray-600">${order.address}</div>
            <div class="text-sm text-blue-600">预算：¥${order.budget}</div>
          </div>`,
        offset: new window.AMap.Pixel(0, -30)
      });
      orderMarker.on('click', () => {
        infoWindow.open(mapInstance.current, orderMarker.getPosition());
      });
    };
    const addUserMarker = () => {
      const userMarker = new window.AMap.Marker({
        position: [userLocation.lng, userLocation.lat],
        map: mapInstance.current,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/blue.png',
        title: '我的位置'
      });
      markersRef.current.push(userMarker);
    };
    loadAMap();
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [order, userLocation]);
  const handleRoutePlanning = () => {
    if (!userLocation || !order.location || !mapInstance.current) return;
    const driving = new window.AMap.Driving({
      map: mapInstance.current,
      policy: window.AMap.DrivingPolicy.LEAST_TIME,
      hideMarkers: true
    });
    driving.search([userLocation.lng, userLocation.lat], [order.location.lng, order.location.lat], (status, result) => {
      if (status === 'complete') {
        toast({
          title: '路线规划完成',
          description: '已显示最佳路线'
        });
      }
    });
  };
  const handleZoomToOrder = () => {
    if (mapInstance.current && order.location) {
      mapInstance.current.setCenter([order.location.lng, order.location.lat]);
      mapInstance.current.setZoom(15);
    }
  };
  if (!order || !order.location) {
    return <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">暂无位置信息</div>
        </CardContent>
      </Card>;
  }
  return <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <MapPin className="mr-2" size={16} />
            位置信息
          </CardTitle>
          <div className="flex gap-2">
            {userLocation && <Button size="sm" onClick={handleRoutePlanning} variant="outline">
                <Car className="mr-1" size={14} />
                路线规划
              </Button>}
            <Button size="sm" onClick={handleZoomToOrder} variant="outline">
              <Navigation className="mr-1" size={14} />
              定位
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-48 rounded-lg border border-gray-300">
          {!mapLoaded && <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">地图加载中...</div>
            </div>}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>订单位置：{order.address}</span>
          </div>
          {userLocation && <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>我的位置</span>
            </div>}
        </div>
      </CardContent>
    </Card>;
}