import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Recipe = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({ ingredients: "" });

  useEffect(() => {
    const url = `/api/v1/show/${params.id}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => setRecipe(response))
      .catch(() => navigate("/recipes"));
  }, [params.id]);

  const addHtmlEntities = (str) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  const deleteRecipe = () => {
    const url = `/api/v1/destroy/${params.id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => navigate("/recipes"))
      .catch((error) => console.log(error.message));
  };

  const ingredientList = () => {
    let ingredientList = "No ingredients available";

    if (recipe.ingredients.length > 0) {
      ingredientList = recipe.ingredients
        .split(",")
        .map((ingredient, index) => (
          <li key={index} className="list-group-item">
            {ingredient}
          </li>
        ));
    }

    return ingredientList;
  };

  const recipeInstruction = addHtmlEntities(recipe.instruction);

  return (
    <div className="">
      <div className="hero position-relative d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
        {recipe.image_url && (
          <div style={{ width: '100%', maxWidth: '800px', height: '100%', overflow: 'hidden', position: 'relative' }}>
            <img
              src={recipe.image_url}
              alt={`${recipe.name} image`}
              style={{
                width: '100%', // Ensures the image doesn't exceed the width of its container
                height: '100%', // Ensures the image fills the height of the container
                objectFit: 'contain', // Ensures the image fits within the container without distortion
                top: '0', // Reset the top position
                left: '0', // Reset the left position
                transform: 'none', // Reset the transform
              }}
            />
          </div>
        )}

      <h1 className="text-center" style={{position:'absolute', top:'50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
        {recipe.name}
      </h1>

      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
            <ul className="list-group">
              <h5 className="mb-2">Ingredients</h5>
              {ingredientList()}
            </ul>
          </div>
          <div className="col-sm-12 col-lg-7">
            <h5 className="mb-2">Preparation Instructions</h5>
            <div
              dangerouslySetInnerHTML={{
                __html: `${recipeInstruction}`,
              }}
            />
          </div>
          <div className="col-sm-12 col-lg-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteRecipe}
            >
              Delete Recipe
            </button>
          </div>
        </div>
        <Link to="/recipes" className="btn btn-link">
          Back to recipes
        </Link>
      </div>
    </div>
  );
};

export default Recipe;