// api/freightService.ts
import { MarginCargo } from '@/components/FindList';
import client, { ApiError } from './client';

// 定义货运订单数据类型
export interface FreightOrder {
  id?: number;
  origin_location: string;
  destination_location: string;
  origin_code: string;
  destination_code: string;
  type: string;
  typeid: number;
  remark: string;
  order_date: string;
  price: number;
  status: number;
  // is_urgent: boolean;
  // has_insurance: boolean;
  user_id: number;
  contact: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

// api/freightService.ts
// 定义筛选条件类型（前端）
export interface FreightFilter {
  page?: number;         // 页码（如 1、2、3...）
  pageSize?: number;     // 每页条数（如 10、20...）
  status?: number;       // 订单状态（1=待接单，2=运输中，3=已完成）
  origin_location?: string; // 可选：按始发地筛选
  destination_location?: string; // 可选：按目的地筛选
}

// 定义创建货运订单的请求类型
export type CreateFreightOrderRequest = Omit<FreightOrder, 'id' | 'status' | 'created_at' | 'updated_at'>;

/**
 * 创建新的货运订单
 * @param {CreateFreightOrderRequest} freightData - 货运订单数据
 * @returns {Promise<FreightOrder>} - 包含订单信息的Promise
 */
export const createFreightOrder = async (
  freightData: CreateFreightOrderRequest
): Promise<FreightOrder> => {
  try {
    const response = await client.post<FreightOrder>('/api/freights', freightData);
    return response.data; // 返回 response.data 而不是整个 response
  } catch (error) {
    console.error('创建货运订单失败:', error);
    throw error as ApiError;
  }
};

/**
 * 获取货运订单列表
 * @returns {Promise<FreightOrder[]>} - 包含订单列表的Promise
 */
export const getFreightOrders = async (): Promise<MarginCargo[]> => {
  try {
    const response = await client.get<MarginCargo[]>( '/api/freights' );
    return response.data; // 返回 response.data 而不是整个 response
  } catch (error) {
    console.error('获取货运订单列表失败:', error);
    throw error as ApiError;
  }
};

/**
 * 获取货运订单详情
 * @returns {Promise<FreightOrder[]>}
 */
export const getFreightOrderId = async (itemId: number): Promise<MarginCargo> => {
  try {
    const response = await client.get<MarginCargo>( `/api/freights/${itemId}` );
    return response.data; // 返回 response.data 而不是整个 response
  } catch (error) {
    console.error('获取货运订单列表失败:', error);
    throw error as ApiError;
  }
};

/**
 * 接单货运订单
 * @returns {Promise<FreightOrder[]>}
 */
export const acceptOrder = async (userId: number, itemId: number) => {
  try
  {
    const params = {
      user_id: userId
    }
    console.log("params", params)
    const response = await client.post( `/api/freights/${itemId}/accept`, params );
    return response.data; // 返回 response.data 而不是整个 response
  } catch (error) {
    console.error('获取货运订单列表失败:', error);
    throw error as ApiError;
  }
};

/**
 * 获取指定用户的货运订单列表
 * @param {number} userId - 用户ID
 * @param {FreightFilter} [filter] - 筛选条件（可选）
 * @returns {Promise<MarginCargo[]>} - 包含订单列表的Promise
 */
export const getUserFreightOrders = async (
  userId: number,
  // filter?: FreightFilter
): Promise<MarginCargo[]> => {
  try {
    const queryParams = new URLSearchParams();
    // if (filter?.page) queryParams.append('page', filter.page.toString());
    // if (filter?.pageSize) queryParams.append('page_size', filter.pageSize.toString());
    // if (filter?.status) queryParams.append('status', filter.status.toString());
    
    const url = `/api/freights/user/${userId}?${queryParams.toString()}`;
    const response = await client.get<MarginCargo[]>( url );
    return response.data;
  } catch (error) {
    console.error(`获取用户${userId}的货运订单列表失败:`, error);
    throw error as ApiError;
  }
};

/**
 * 完成订单操作（将订单状态改为已完成）
 * @param {number} orderId - 订单ID
 * @param {number} userId - 操作用户ID（必须是接单用户）
 * @returns {Promise<{order_id: number; status: number}>} - 操作结果
 */
export const completeOrder = async ( orderId: number, userId: number ) =>
{
  console.log('complete', orderId, userId)
  try {
    const response = await client.post<{
      message: string;
      order_id: number;
      // status: number;
    }>(`/api/freights/${orderId}/complete`, { user_id: userId });
    return response.data;
  } catch (error) {
    console.error(`完成订单失败（订单${orderId}）:`, error);
    throw error as ApiError;
  }
};