package com.ahmedesawy.petalia.coupon;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.petalia.common.base.DiscountType;
import com.ahmedesawy.petalia.common.exception.NotFoundException;
import com.ahmedesawy.petalia.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.petalia.coupon.dto.CoupounRequest;
import com.ahmedesawy.petalia.coupon.dto.SummaryCouponResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponService {

    private static final String CHARACTERS ="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final static SecureRandom secureRandom = new SecureRandom();
    
    private final CouponRepository couponRepository;

    // ---- QUERIES -------------------------------------------------------
    public List<SummaryCouponResponse> getAllCoupounsSummary() {
        return couponRepository.findAll()
                .stream()
                .map(CouponMapper::toSummaryResponse)
                .toList();
    }

    public Coupon getActiveCoupounById(Integer id) {
        return couponRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new NotFoundException("Active coupon with this id '" + id + "' not found!"));
    }

    public Coupon getCoupounByCode(String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new NotFoundException("coupon with this code '" + code + "' not found!"));
    }

    // ---- VALIAD ---------------------------------------------------------
    @Transactional
    public Coupon getValidCoupon(String code) {
        Coupon coupon = this.getCoupounByCode(code);

        boolean needsUpdate = false;

        if (LocalDateTime.now().isAfter(coupon.getEndAt()) && !Boolean.TRUE.equals(coupon.getDateEnded())) {
            coupon.setDateEnded(true);
            needsUpdate = true;
        }

        if (coupon.getUsedCount() >= coupon.getUsageLimit() && !Boolean.TRUE.equals(coupon.getUsageEnded())) {
            coupon.setUsageEnded(true);
            needsUpdate = true;
        }

        if (needsUpdate) couponRepository.save(coupon);
        

        if (!coupon.isValid()) throw new IllegalStateException("Invalid coupon");
        

        return coupon;
    }

    // ---- APPLY ------------------------------------------------------
    @Transactional 
    public void applyCoupon(String code) {
        int updated = couponRepository.incrementUsage(code);
        if (updated == 0) throw new IllegalStateException("Invalid coupon");
    }


    // ---- CREATE -------------------------------------------------------

    public String createCoupoun(CoupounRequest request) {
        // Validate
        validateCouponDates(request.getStartAt(), request.getEndAt());
        validateDiscount(request.getDiscountType(), request.getDiscountValue());
        validateUniqueCode(request.getCode());

        Coupon coupoun =  Coupon.builder()
                .code(request.getCode())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minimumOrderAmount(request.getMinimumOrderAmount())
                .maximumDiscountAmount(request.getMaximumDiscountAmount())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .active(request.getActive())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .build();

        couponRepository.save(coupoun);


        return  "Coupon created successfully!";
    }

    public String generateCode() {

        String code;
        int attempts = 0;
        final int MAX_ATTEMPTS = 100;

        do {
            code = generateRandomCode(10);
            attempts++;
        } while (couponRepository.existsByCode(code) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) 
            throw new RuntimeException("Failed to generate unique coupon code after " + MAX_ATTEMPTS + " attempts");

        return code;
    }


    // ---- UPDATE -------------------------------------------------------

    public Coupon updateCoupoun(Integer id, CoupounRequest request) {
        Coupon coupoun = couponRepository.findByIdOrThrow(id);

        validateCouponDates(request.getStartAt(), request.getEndAt());
        validateDiscount(request.getDiscountType(), request.getDiscountValue());

        if (!coupoun.getCode().equals(request.getCode())) {
            validateUniqueCode(request.getCode());
            coupoun.setCode(request.getCode());
        }

        coupoun.setDiscountType(request.getDiscountType());
        coupoun.setDiscountValue(request.getDiscountValue());
        coupoun.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupoun.setMaximumDiscountAmount(request.getMaximumDiscountAmount());
        coupoun.setStartAt(request.getStartAt());
        coupoun.setEndAt(request.getEndAt());
        coupoun.setActive(request.getActive());
        coupoun.setUsageLimit(request.getUsageLimit());

        return couponRepository.save(coupoun);
    }


    // ---- DELETE -------------------------------------------------------
    public void deleteCoupounPermanently(Integer id) {
        Coupon coupoun = couponRepository.findByIdOrThrow(id);
        couponRepository.delete(coupoun);
    }



    // ---- HELPERS -------------------------------------------------------



    // Check if startAt < endAt
    private void validateCouponDates(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt == null || endAt == null) 
            throw new IllegalArgumentException("Start and end dates cannot be null");
        
        if (!startAt.isBefore(endAt)) 
            throw new IllegalArgumentException("Start date must be before end date");
        
    }

    // Check if code is unique
    private void validateUniqueCode(String code) {
        if (couponRepository.existsByCode(code)) 
            throw new ResourceAlreadyExistsException("Coupon code: " + code + " already exists!");
        
    }

    // Check if percentage is less than 100%
    private void validateDiscount(DiscountType discountType,BigDecimal discountValue) {
        if (discountType == null || discountValue == null) return;
        

        if (discountType == DiscountType.PERCENTAGE
                && discountValue.compareTo(BigDecimal.valueOf(100)) > 0) {

            throw new IllegalArgumentException(
                    "Percentage discount value cannot be greater than 100"
            );
        }
    }

    // Generate random code 
    private String generateRandomCode(int length) {
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = secureRandom.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }

        return code.toString();
    }


}