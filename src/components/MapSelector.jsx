// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Input, Card, CardContent, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { MapPin, Search, Navigation } from 'lucide-react';

export function MapSelector({
  onLocationSelect,
  initialAddress = '',
  className = ''
}) {
  const [address, setAddress] = useState(initialAddress);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // 加载高德地图API
    const loadAMap = () => {
      if (window.AMap) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=aa5927454d6839e16fc2da4b741ca2aa&plugin=AMap.Geocoder,AMap.PlaceSearch,AMap.ToolBar`;
      script.onload = initMap;
      script.onerror = () => {
        toast({
          title: '地图加载失败',
          description: '请检查网络连接',
          variant: 'destructive'
        });
      };
      document.head.appendChild(script);
    };
    const initMap = () => {
      if (!mapRef.current) return;
      try {
        mapInstance.current = new window.AMap.Map(mapRef.current, {
          zoom: 13,
          center: [116.397428, 39.90923],
          // 北京中心点
          viewMode: '2D'
        });
        // 添加工具栏
        mapInstance.current.addControl(new window.AMap.ToolBar());
        // 添加点击事件
        mapInstance.current.on('click', handleMapClick);
        // 获取当前位置
        getCurrentLocation();
        setMapLoaded(true);
      } catch (error) {
        toast({
          title: '地图初始化失败',
          description: error.message,
          variant: 'destructive'
        });
      }
    };
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const {
            latitude,
            longitude
          } = position.coords;
          setCurrentLocation({
            lng: longitude,
            lat: latitude
          });
          mapInstance.current.setCenter([longitude, latitude]);
          // 添加定位标记
          new window.AMap.Marker({
            position: [longitude, latitude],
            map: mapInstance.current,
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/position.png'
          });
        }, error => {
          console.warn('获取位置失败:', error);
          toast({
            title: '定位失败',
            description: '请手动选择位置',
            variant: 'destructive'
          });
        });
      }
    };
    loadAMap();
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);
  const handleMapClick = e => {
    const {
      lng,
      lat
    } = e.lnglat;
    // 清除之前的标记
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    // 添加新标记
    markerRef.current = new window.AMap.Marker({
      position: [lng, lat],
      map: mapInstance.current
    });
    // 反向地理编码获取地址
    const geocoder = new window.AMap.Geocoder();
    geocoder.getAddress([lng, lat], (status, result) => {
      if (status === 'complete' && result.regeocode) {
        const selectedAddress = result.regeocode.formattedAddress;
        setAddress(selectedAddress);
        onLocationSelect?.({
          lng,
          lat,
          address: selectedAddress
        });
      }
    });
  };
  const handleSearch = () => {
    if (!address.trim() || !mapInstance.current) return;
    const placeSearch = new window.AMap.PlaceSearch({
      map: mapInstance.current
    });
    placeSearch.search(address, (status, result) => {
      if (status === 'complete' && result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0];
        mapInstance.current.setCenter([poi.location.lng, poi.location.lat]);
        handleMapClick({
          lnglat: poi.location
        });
      } else {
        toast({
          title: '搜索失败',
          description: '未找到相关地址',
          variant: 'destructive'
        });
      }
    });
  };
  const handleCurrentLocation = () => {
    if (currentLocation && mapInstance.current) {
      mapInstance.current.setCenter([currentLocation.lng, currentLocation.lat]);
    }
  };
  return <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2" size={20} />
            选择服务地址
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 地址搜索 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input value={address} onChange={e => setAddress(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} placeholder="输入地址搜索或点击地图选择" className="pl-10" />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              搜索
            </Button>
            <Button onClick={handleCurrentLocation} variant="outline" title="定位到当前位置">
              <Navigation size={16} />
            </Button>
          </div>

          {/* 地图容器 */}
          <div ref={mapRef} className="w-full h-64 rounded-lg border border-gray-300">
            {!mapLoaded && <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">地图加载中...</div>
              </div>}
          </div>

          <div className="text-xs text-gray-500">
            <p>• 点击地图选择位置，或输入地址搜索</p>
            <p>• 支持精确定位，确保服务地址准确</p>
          </div>
        </CardContent>
      </Card>
    </div>;
}