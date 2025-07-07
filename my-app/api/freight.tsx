// api/freightService.ts
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
  status: string;
  // is_urgent: boolean;
  // has_insurance: boolean;
  user_id: number;
  contact: string;
  email: string;
  created_at?: string;
  updated_at?: string;
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
export const getFreightOrders = async (): Promise<FreightOrder[]> => {
  try {
    const response = await client.get<FreightOrder[]>( '/api/freights' );
    return response.data; // 返回 response.data 而不是整个 response
  } catch (error) {
    console.error('获取货运订单列表失败:', error);
    throw error as ApiError;
  }
};