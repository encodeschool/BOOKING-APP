package uz.encode.fresh.booking_service.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardMetricsResponse {

    private Double revenue;

    private Long bookings;

    private Long pending;

    private Long completed;

    private Integer revenueGrowth;

    private Integer bookingGrowth;

    private Integer pendingGrowth;

    private Integer completedGrowth;
}