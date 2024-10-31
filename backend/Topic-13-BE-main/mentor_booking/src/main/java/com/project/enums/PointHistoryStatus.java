
package com.project.enums;

/**
 *
 * @author trinh
 */
public enum PointHistoryStatus {
    EARNED, // Điểm đã được cộng.
    REDEEMED, // Điểm đã được sử dụng hoặc đổi.
    ADJUSTED, // Điểm đã được điều chỉnh, có thể là cộng hoặc trừ.
    EXPIRED // Điểm đã hết hạn và không còn hiệu lực.
}
