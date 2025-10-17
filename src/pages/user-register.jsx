// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Phone, Lock, User } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function UserRegister(props) {
  const {
    $w
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const form = useForm();
  const onRegister = async data => {
    setIsLoading(true);
    try {
      // 调用数据模型创建用户
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_worker',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            name: data.name,
            phone: data.phone,
            specialty: '客户',
            credit_score: 100,
            order_count: 0,
            completed_count: 0,
            status: 'active',
            register_time: new Date().getTime(),
            rating: 5.0,
            work_years: 0
          }
        }
      });
      toast({
        title: '注册成功',
        description: '欢迎成为我们的用户'
      });
      $w.utils.navigateTo({
        pageId: 'user-demand-list',
        params: {
          userId: result.id
        }
      });
    } catch (error) {
      toast({
        title: '注册失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const onLogin = async data => {
    setIsLoading(true);
    try {
      // 查询用户
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_worker',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              phone: {
                $eq: data.phone
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result.records.length > 0) {
        toast({
          title: '登录成功',
          description: `欢迎回来，${result.records[0].name}`
        });
        $w.utils.navigateTo({
          pageId: 'user-demand-list',
          params: {
            userId: result.records[0]._id
          }
        });
      } else {
        toast({
          title: '登录失败',
          description: '用户不存在',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-600 mb-2">用电业务报装助手</h1>
          <p className="text-gray-600">用户端</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>用户登录</CardTitle>
                <CardDescription>请输入您的手机号和密码</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
                    <FormField control={form.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>手机号</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="请输入手机号" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input type="password" placeholder="请输入密码" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? '登录中...' : '登录'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>用户注册</CardTitle>
                <CardDescription>创建您的用电报装账户</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onRegister)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>姓名</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="请输入姓名" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>手机号</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="请输入手机号" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input type="password" placeholder="请设置密码" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? '注册中...' : '注册'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}