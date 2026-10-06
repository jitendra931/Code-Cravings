package com.codecravings.request;

import java.util.List;

import com.codecravings.model.Category;
import com.codecravings.model.IngrediantsItem;

import lombok.Data;

@Data
public class UpdateFoodReq {

    private String name;
    private String description;
    private Double price;
    private Category category;
    private List<String> images;
    private boolean vegetarian;
    private boolean seasonal;
    private List<IngrediantsItem> ingrediants;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public void setVegetarian(boolean vegetarian) {
        this.vegetarian = vegetarian;
    }

    public boolean isSeasonal() {
        return seasonal;
    }

    public void setSeasonal(boolean seasonal) {
        this.seasonal = seasonal;
    }

    public List<IngrediantsItem> getIngrediants() {
        return ingrediants;
    }

    public void setIngrediants(List<IngrediantsItem> ingrediants) {
        this.ingrediants = ingrediants;
    }
}