import { Save, Sparkle } from "lucide-react";
import useLoading from "../../hooks/useLoading";
import { useEffect, useState } from "react";
import { getCategoryAction } from "../../redux/category/categoryAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormControl from "../../components/common-Input/FormControl";
import LoadingSpinner from "../../components/helper/LoadingSpinner";
import {
  addProductAction,
  updateProductAction,
} from "../../redux/product/productAction";
import { ProductFormControls } from "../../config/formCongif";
import useForm from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { generateAIDescription } from "../../services/service";
import { Button } from "../../components/ui/button";
import { uploadMedia } from "../../axios/uploadAxios";
import ImageUploader from "../common-Input/ImageUploader";

const ProductForm = ({ initialFormData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { formData, handleOnChange, setFormData } = useForm(initialFormData);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

  // redux store
  const { categories } = useSelector((state) => state.category);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategoryAction());
  }, [dispatch]);

  // Sync form state with initialFormData prop
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData, setFormData]);

  // Handle thumbnail file selection
  const handleThumbnailSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setThumbnailFile(file);
    }
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async () => {
    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image first");
      return;
    }

    const formData = new FormData();
    formData.append("images", thumbnailFile);

    try {
      startLoading();
      setThumbnailUploadProgress(0);

      const response = await uploadMedia(formData, (progress) => {
        setThumbnailUploadProgress(progress);
      });

      if (response.status === "success") {
        const uploaded = response.payload;

        let thumbnailUrl = "";

        if (Array.isArray(uploaded)) {
          thumbnailUrl = uploaded[0].secure_url;
        } else if (uploaded && uploaded.secure_url) {
          thumbnailUrl = uploaded.secure_url;
        }

        // Update form data with thumbnail URL
        setFormData((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
        setThumbnailFile(null);
        setThumbnailUploadProgress(0);
        toast.success("Thumbnail uploaded successfully!");
      }
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      toast.error("Failed to upload thumbnail. Please try again.");
    } finally {
      stopLoading();
      setThumbnailUploadProgress(0);
    }
  };

  // Remove thumbnail
  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    setThumbnailFile(null);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();

    // validation
    if (
      !formData.title ||
      !formData.categoryId ||
      !formData.description ||
      !formData.price ||
      !formData.stock ||
      !formData.status ||
      !formData.thumbnail
    ) {
      toast("All fields required");
      return;
    }

    if (
      formData.price < 0 ||
      formData.stock < 0 ||
      formData.discountPrice < 0
    ) {
      toast("Price, stock, and discount price cannot be negative");
      return;
    }

    try {
      startLoading();

      // Build product payload
      const productData = {
        ...formData,
        tags: (formData?.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        sizes: (formData?.sizes || "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        colors: (formData?.colors || "")
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
      };

      if (!productData.thumbnail && thumbnailFile) {
        toast.error("Please upload the thumbnail first.");
        stopLoading();
        return;
      }

      console.log("Final productData before submit:", productData);

      // Check if we're editing or creating based on formData._id
      if (formData._id) {
        dispatch(updateProductAction(formData._id, productData));
      } else {
        dispatch(addProductAction(productData));
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to save product", err);
      toast.error("Failed to save product");
    } finally {
      stopLoading();
    }
  };

  // Recursive function to show nested categories with indent
  const renderCategoryOptions = (categories, depth = 0) => {
    let options = [];
    categories.forEach((cat) => {
      options.push({
        value: cat._id,
        label: `${Array(depth).fill("\u00A0\u00A0\u00A0").join("")}${cat.name}`,
      });
      if (cat.children?.length > 0) {
        options = options.concat(
          renderCategoryOptions(cat.children, depth + 1)
        );
      }
    });
    return options;
  };

  // Helper to get category name from id
  const getCategoryName = (categoryId) => {
    const findCategory = (cats) => {
      for (const cat of cats) {
        if (cat._id === categoryId) return cat.name;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findCategory(categories) || "not specified";
  };

  // AI Description Handler
  const handleAIDescription = async () => {
    startLoading();
    try {
      const aiDesc = await generateAIDescription({
        title: formData.title,
        category: getCategoryName(formData.categoryId),
        tags: formData.tags,
        brand: formData.brand,
      });
      setFormData((prev) => ({ ...prev, description: aiDesc }));
    } catch (err) {
      toast.error("Failed to generate AI description");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
        Basic Information
      </h2>

      <form
        onSubmit={handleSubmitProduct}
        className="space-y-4"
        autoComplete="on"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ProductFormControls.map((field, index) => {
            return (
              <div
                key={index}
                className={field.type === "textarea" ? "col-span-full" : ""}
              >
                <FormControl
                  label={field.label}
                  handleOnChange={handleOnChange}
                  inputAttributes={{
                    type: field.type,
                    name: field.name,
                    value: formData[field.name],
                    placeholder: field.placeholder,
                    autoComplete: field.autoComplete,
                    id: field.name,
                  }}
                  options={
                    field.name === "categoryId"
                      ? renderCategoryOptions(categories)
                      : field.options
                  }
                />
                {/* AI Description Button for Description Field */}
                {field.name === "description" && (
                  <Button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    onClick={handleAIDescription}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      `AI Generating...`
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkle className="h-4 w-4 animate-pulse" />
                        <span>Auto-Generate Description</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Thumbnail Upload Section */}
        <div className="col-span-full">
          <ImageUploader
            multiple={false}
            selectedFiles={thumbnailFile ? [thumbnailFile] : []}
            onFileChange={handleThumbnailSelection}
            onRemoveSelected={() => setThumbnailFile(null)}
            onUpload={handleThumbnailUpload}
            isLoading={isLoading}
            uploadProgress={thumbnailUploadProgress}
            uploadedImages={formData.thumbnail ? [formData.thumbnail] : []}
            onRemoveUploaded={(_, __) => handleRemoveThumbnail()}
            label="Product Thumbnail *"
            maxSizeMB={5}
            hideInputIfUploaded={true}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            {isLoading ? (
              <LoadingSpinner />
            ) : formData._id ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
