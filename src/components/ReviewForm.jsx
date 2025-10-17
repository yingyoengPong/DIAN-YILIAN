// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea } from '@/components/ui';
// @ts-ignore;
import { Star } from 'lucide-react';

export function ReviewForm({
  onSubmit
}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const handleSubmit = () => {
    if (rating === 0) {
      alert('请选择评分');
      return;
    }
    onSubmit({
      rating,
      comment: reviewText
    });
  };
  return <Card>
      <CardHeader>
        <CardTitle>服务评价</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">评分</label>
          <div className="flex space-x-1 mt-2">
            {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} onClick={() => setRating(star)} />)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">评价内容</label>
          <Textarea placeholder="请对本次服务进行评价..." value={reviewText} onChange={e => setReviewText(e.target.value)} className="mt-2" />
        </div>
        
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
          提交评价
        </Button>
      </CardContent>
    </Card>;
}