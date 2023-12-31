import Product from "../models/product";
import Category from "../models/category";

export const getAll = async (req, res) => {
    const { _page = 1, _limit = 12, _sort = "createAt", _order = "asc" } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order === "desc" ? -1 : 1,
        },
    };
    try {
        const products = await Product.paginate({}, options);
        if (products.length === 0) {
            res.status(404).json({
                message: "Không có sản phẩm nào",
            });
        }
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("categoryId");
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        return res.status(200).json({
            message: "Product found",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
export const create = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        if (!product) {
            return res.status(400).json({
                message: "Không thể tạo sản phẩm",
            });
        }

        await Category.findByIdAndUpdate(product.categoryId, {
            $addToSet: {
                products: product._id,
            },
        });

        return res.status(201).json({
            message: "Product created",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Sản phẩm đã được xóa thành công",
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        return res.status(200).json({
            message: "Sản phẩm đã được cập nhật thành công",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};