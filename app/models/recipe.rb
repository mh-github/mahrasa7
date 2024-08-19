class Recipe < ApplicationRecord
	validates :name, presence: true
 	validates :ingredients, presence: true
  	validates :instruction, presence: true

	has_one_attached :image
end
