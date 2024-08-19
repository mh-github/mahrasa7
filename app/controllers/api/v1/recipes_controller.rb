class Api::V1::RecipesController < ApplicationController
  include Rails.application.routes.url_helpers
  before_action :set_recipe, only: %i[show destroy]

  def index
    recipes = Recipe.all.map do |recipe|
      recipe.as_json.merge(
        image_url: recipe.image.attached? ? rails_blob_url(recipe.image, only_path: true) : nil
      )
    end
    render json: recipes
  end

  def create
    recipe = Recipe.new(recipe_params)
    puts "Recipe object created."
    if recipe.save
      puts "Recipe saved to database"
      render json: recipe, status: :created
    else
      render json: { errors: recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    recipe = Recipe.find(params[:id])
    render json: recipe.as_json.merge(
      image_url: recipe.image.attached? ? rails_blob_url(recipe.image, only_path: true) : nil
    )
  end

  def destroy
    @recipe&.destroy
    render json: { message: 'Recipe deleted!' }
  end

  private

  def recipe_params
    params.require(:recipe).permit(:name, :ingredients, :instruction, :image)
  end

  def set_recipe
    @recipe = Recipe.find(params[:id])
  end

  def default_url_options
    { host: request.base_url }
  end
end