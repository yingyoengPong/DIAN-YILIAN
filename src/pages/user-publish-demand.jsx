// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, useToast, Form, FormField, FormItem } from '@/components/ui';
// @ts-ignore;
import { Calendar, MapPin, DollarSign, Phone, Upload } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function UserPublishDemand(props) {
  const {
    $w
  } = props;
  const [images, setImages] = useState([]);
  const {
    toast
  } = useToast();
  const form = useForm();
  const onSubmit = async data => {
    try {
      // 创建需求单
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            customer_id: $w.page.dataset.params.userId,
            customer_info: {
              name: data.contactName,
              phone: data.contactPhone
            },
            service_address: data.address,
            demand_description: data.description,
            business_type: data.businessType,
            budget: parseFloat(data.budget),
            status: 'pending',
            publish_time: new Date().getTime(),
            appointment_time: new Date(data.appointmentTime).getTime(),
            images: images
          }
        }
      });

      // 创建资金托管记录
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_escrow',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            demand_id: result.id,
            customer_payment_amount: parseFloat(data.budget),
            worker_receivable_amount: parseFloat(data.budget) * 0.9,
            // 平台抽成10%
            platform_commission: parseFloat(data.budget) * 0.1,
            status: 'pending',
            transaction_type: 'deposit',
            customer_id: $w.page.dataset.params.userId,
            order_number: `ORD-${Date.now()}`
          }
        }
      });
      toast({
        title: '发布成功',
        description: '您的用电报装需求已发布，技工将很快联系您'
      });
      $w.utils.navigateTo({
        pageId: 'user-demand-list',
        params: {
          userId: $w.page.dataset.params.userId
        }
      });
    } catch (error) {
      toast({
        title: '发布失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h1 className="text-lg font-semibold text-center">发布用电需求</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>需求信息</CardTitle>
              <CardDescription>请详细描述您的用电需求</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="businessType" render={({
              field
            }) => <FormItem>
                    <Label>业务类型</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择业务类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">居民用电报装</SelectItem>
                        <SelectItem value="commercial">商业用电报装</SelectItem>
                        <SelectItem value="industrial">工业用电报装</SelectItem>
                        <SelectItem value="maintenance">电路维修</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>} />

              <FormField control={form.control} name="description" render={({
              field
            }) => <FormItem>
                    <Label>需求描述</Label>
                    <Textarea placeholder="请详细描述您的用电需求，包括用电地址、用电类型、预计用电量等信息" className="min-h-[100px]" {...field} />
                  </FormItem>} />

              <FormField control={form.control} name="address" render={({
              field
            }) => <FormItem>
                    <Label>服务地址</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="请选择服务地址" className="pl-10" {...field} />
                    </div>
                  </FormItem>} />

              <FormField control={form.control} name="appointmentTime" render={({
              field
            }) => <FormItem>
                    <Label>预约时间</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="datetime-local" className="pl-10" {...field} />
                    </div>
                  </FormItem>} />

              <FormField control={form.control} name="budget" render={({
              field
            }) => <FormItem>
                    <Label>预算范围（元）</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="number" placeholder="请输入预算金额" className="pl-10" {...field} />
                    </div>
                  </FormItem>} />

              <FormField control={form.control} name="contactName" render={({
              field
            }) => <FormItem>
                    <Label>联系人姓名</Label>
                    <Input placeholder="请输入联系人姓名" {...field} />
                  </FormItem>} />

              <FormField control={form.control} name="contactPhone" render={({
              field
            }) => <FormItem>
                    <Label>联系电话</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="请输入联系电话" className="pl-10" {...field} />
                    </div>
                  </FormItem>} />

              <div>
                <Label>上传图片</Label>
                <div className="mt-2">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-600">上传现场图片</span>
                  </label>
                  {images.length > 0 && <div className="mt-2 grid grid-cols-3 gap-2">
                      {images.map((image, index) => <div key={index} className="relative">
                          <img src={URL.createObjectURL(image)} alt={`upload-${index}`} className="w-full h-20 object-cover rounded" />
                        </div>)}
                    </div>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
            发布需求
          </Button>
        </form>
      </Form>
    </div>;
}