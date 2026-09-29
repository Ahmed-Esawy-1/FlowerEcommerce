package com.ahmedesawy.petalia.watchlist;

import com.ahmedesawy.petalia.product.ProductMapper;
import com.ahmedesawy.petalia.watchlist.dto.WatchlistProductResponse;

public class WatchlistMapper {
    
    // MAIN
    public static WatchlistProductResponse toResponse(Watchlist watchlist) {
        return WatchlistProductResponse.builder()
                .id(watchlist.getId())
                .productId(watchlist.getProduct().getId())
                .productNameEn(watchlist.getProduct().getNameEn())
                .productNameAr(watchlist.getProduct().getNameAr())
                .price(watchlist.getProduct().getPrice())
                .primaryImage(ProductMapper.resolvePrimaryImage(watchlist.getProduct()))
                .build();
    }
}
