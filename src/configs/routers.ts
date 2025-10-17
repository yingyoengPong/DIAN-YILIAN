import USER_REGISTER from '../pages/user-register.jsx';
import USER_PUBLISH-DEMAND from '../pages/user-publish-demand.jsx';
import USER_DEMAND-LIST from '../pages/user-demand-list.jsx';
import USER_DEMAND-DETAIL from '../pages/user-demand-detail.jsx';
import WORKER_REGISTER from '../pages/worker-register.jsx';
import WORKER_ORDER-HALL from '../pages/worker-order-hall.jsx';
import WORKER_ORDER-DETAIL from '../pages/worker-order-detail.jsx';
import PLATFORM_ORDER-MANAGE from '../pages/platform-order-manage.jsx';
import PLATFORM_ESCROW from '../pages/platform-escrow.jsx';
import PLATFORM_DISPUTE from '../pages/platform-dispute.jsx';
import PLATFORM_CREDIT from '../pages/platform-credit.jsx';
import INDEX from '../pages/index.jsx';
import CREATEORDER from '../pages/createOrder.jsx';
import ORDERDETAIL from '../pages/orderDetail.jsx';
export const routers = [{
  id: "user-register",
  component: USER_REGISTER
}, {
  id: "user-publish-demand",
  component: USER_PUBLISH-DEMAND
}, {
  id: "user-demand-list",
  component: USER_DEMAND-LIST
}, {
  id: "user-demand-detail",
  component: USER_DEMAND-DETAIL
}, {
  id: "worker-register",
  component: WORKER_REGISTER
}, {
  id: "worker-order-hall",
  component: WORKER_ORDER-HALL
}, {
  id: "worker-order-detail",
  component: WORKER_ORDER-DETAIL
}, {
  id: "platform-order-manage",
  component: PLATFORM_ORDER-MANAGE
}, {
  id: "platform-escrow",
  component: PLATFORM_ESCROW
}, {
  id: "platform-dispute",
  component: PLATFORM_DISPUTE
}, {
  id: "platform-credit",
  component: PLATFORM_CREDIT
}, {
  id: "index",
  component: INDEX
}, {
  id: "createOrder",
  component: CREATEORDER
}, {
  id: "orderDetail",
  component: ORDERDETAIL
}]