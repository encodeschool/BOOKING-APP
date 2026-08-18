package uz.encode.fresh.booking_service.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uz.encode.fresh.booking_service.dto.BookingResponse;
import uz.encode.fresh.booking_service.dto.CreateBookingRequest;
import uz.encode.fresh.booking_service.dto.RescheduleBookingRequest;
import uz.encode.fresh.booking_service.entity.Booking;
import uz.encode.fresh.booking_service.integration.CoreServiceClient;
import uz.encode.fresh.booking_service.integration.NotificationClient;
import uz.encode.fresh.booking_service.integration.dto.BusinessDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.ServiceDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.StaffDetailsResponse;
import uz.encode.fresh.booking_service.model.BookingStatus;
import uz.encode.fresh.booking_service.repository.BookingRepository;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CoreServiceClient coreServiceClient;

    @Mock
    private NotificationClient notificationClient;

    private BookingServiceImpl bookingService;

    @BeforeEach
    void setUp() {
        bookingService = new BookingServiceImpl(bookingRepository, coreServiceClient, notificationClient);
    }

    @Test
    void create_allowsPublicBookingWithoutClientId_andSetsBookingToken() {
        CreateBookingRequest request = new CreateBookingRequest();
        request.businessId = 5L;
        request.serviceId = 7L;
        request.staffId = 9L;
        request.bookingDate = LocalDate.now().plusDays(1);
        request.bookingTime = "10:00";
        request.customerName = "Guest";
        request.customerEmail = "guest@example.com";
        request.customerPhone = "123456";

        when(coreServiceClient.getBusiness(5L)).thenReturn(new BusinessDetailsResponse(5L, 1L, "Glow Studio"));
        when(coreServiceClient.getService(7L)).thenReturn(new ServiceDetailsResponse(7L, 5L, "Haircut", 30, true));
        when(coreServiceClient.getStaff(9L)).thenReturn(new StaffDetailsResponse(9L, 5L, "Ana", true, 5));
        when(coreServiceClient.getWorkingHours(any(Long.class), any(java.time.DayOfWeek.class))).thenReturn(new uz.encode.fresh.booking_service.integration.dto.WorkingHoursResponse(5L, java.time.DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(17, 0), false));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        BookingResponse response = bookingService.create(null, request);

        assertNotNull(response);
        assertNotNull(response.getBookingToken());
    }

    @Test
    void rescheduleBooking_updatesDateTimeAndSendsNotification() {
        Booking booking = new Booking();
        booking.setId(10L);
        booking.setClientId(1L);
        booking.setBusinessId(5L);
        booking.setServiceId(7L);
        booking.setStaffId(9L);
        booking.setBookingDate(LocalDate.of(2025, 1, 10));
        booking.setStartTime(LocalTime.of(10, 0));
        booking.setEndTime(LocalTime.of(10, 30));
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCustomerEmail("customer@example.com");
        booking.setCustomerName("Jane");
        booking.setCustomerPhone("123456");

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(coreServiceClient.getBusiness(5L)).thenReturn(new BusinessDetailsResponse(5L, 1L, "Glow Studio"));
        when(coreServiceClient.getService(7L)).thenReturn(new ServiceDetailsResponse(7L, 5L, "Haircut", 30, true));
        when(coreServiceClient.getStaff(9L)).thenReturn(new StaffDetailsResponse(9L, 5L, "Ana", true, 5));

        RescheduleBookingRequest request = new RescheduleBookingRequest();
        request.setBookingDate(LocalDate.now().plusDays(7));
        request.setBookingTime("11:00");
        request.setReason("Client requested a new slot");

        BookingResponse response = bookingService.rescheduleBooking(1L, 10L, request);

        assertEquals(request.getBookingDate(), response.getBookingDate());
        assertEquals(LocalTime.of(11, 0), response.getStartTime());
        assertEquals(LocalTime.of(11, 30), response.getEndTime());
        verify(notificationClient).sendBookingStatusUpdate(anyMap());
    }
}
