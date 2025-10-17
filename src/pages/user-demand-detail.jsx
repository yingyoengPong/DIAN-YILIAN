// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast, Card, CardContent } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft } from 'lucide-react';

import { DemandInfoCard } from '@/components/DemandInfoCard';
import { WorkerInfoCard } from '@/components/WorkerInfoCard';
import { ServiceProgress } from '@/components/ServiceProgress';
import { ReviewForm } from '@/components/ReviewForm';
export default function UserDemandDetail(props) {
  const {
    $w
  } = props;
  const [demand, setDemand] = useState(null);
  const [worker, setWorker] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const demandId = $w.page.dataset.params.id;
  useEffect(() => {
    loadDemandDetail();
  }, [demandId]);
  const loadDemandDetail = async () => {
    try {
      const demandResult = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: demandId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      setDemand(demandResult);
      if (demandResult.worker_id) {
        const workerResult = await $w.cloud.callDataSource({
          dataSourceName: 'electric_worker',
          methodName: 'wedaGetItemV2',
          params: {
            filter: {
              where: {
                _id: {
                  $eq: demandResult.worker_id
                }
              }
            },
            select: {
              $master: true
            }
          }
        });
        setWorker(workerResult);
      }
    } catch (error) {
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleComplete = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'completed',
            completion_time: new Date().getTime()
          },
          filter: {
            where: {
              _id: {
                $eq: demandId
              }
            }
          }
        }
      });

      // 更新资金托管状态
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_escrow',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'completed',
            settlement_time: new Date().getTime()
          },
          filter: {
            where: {
              demand_id: {
                $eq: demandId
              }
            }
          }
        }
      });
      toast({
        title: '确认成功',
        description: '已确认服务完成'
      });
      setShowReview(true);
      loadDemandDetail();
    } catch (error) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleReview = async reviewData => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            evaluation: {
              rating: reviewData.rating,
              comment: reviewData.comment,
              evaluation_time: new Date().getTime()
            }
          },
          filter: {
            where: {
              _id: {
                $eq: demandId
              }
            }
          }
        }
      });

      // 更新技工评分
      if (worker) {
        const newRating = (worker.rating * worker.completed_count + reviewData.rating) / (worker.completed_count + 1);
        await $w.cloud.callDataSource({
          dataSourceName: 'electric_worker',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              rating: newRating,
              completed_count: worker.completed_count + 1
            },
            filter: {
              where: {
                _id: {
                  $eq: demand.worker_id
                }
              }
            }
          }
        });
      }
      toast({
        title: '评价成功',
        description: '感谢您的评价'
      });
      $w.utils.navigateBack();
    } catch (error) {
      toast({
        title: '评价失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>;
  }
  if (!demand) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">需求不存在</div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 mr-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">需求详情</h1>
      </div>

      <div className="p-4 space-y-4 pb-20">
        <DemandInfoCard demand={demand} />
        
        {worker && <WorkerInfoCard worker={worker} />}
        
        <ServiceProgress status={demand.status} />
        
        {demand.status === 'processing' && <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleComplete}>
            确认服务完成
          </Button>}
        
        {demand.status === 'completed' && !demand.evaluation && <ReviewForm onSubmit={handleReview} />}
        
        {demand.evaluation && <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="text-yellow-400 mr-2">
                  {'★'.repeat(demand.evaluation.rating)}
                  {'☆'.repeat(5 - demand.evaluation.rating)}
                </div>
                <span className="text-sm text-gray-600">{demand.evaluation.rating}星评价</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{demand.evaluation.comment}</p>
            </CardContent>
          </Card>}
      </div>
    </div>;
}