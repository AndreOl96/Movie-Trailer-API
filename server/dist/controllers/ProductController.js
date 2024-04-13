import ProductService from "../services/ProductService.js";
const productsPath = "./src/data/products.json";
class ProductController {
    getAllProducts(req, res) {
        const products = ProductService.getAll();
        return res.json(products);
    }
    ;
    getProductById(req, res) {
        const product = ProductService.getOne(parseInt(req.params.id));
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        return res.json(product);
    }
    ;
    createProduct(req, res) {
        var _a;
        try {
            const newProduct = ProductService.create(req.body, (_a = req.files) === null || _a === void 0 ? void 0 : _a.image);
            return res.status(201).json(newProduct);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    ;
    updateProduct(req, res) {
        var _a;
        const productId = parseInt(req.params.id);
        const updatedProduct = ProductService.update(req.body, productId, (_a = req.files) === null || _a === void 0 ? void 0 : _a.image);
        if (!updatedProduct)
            return res.status(404).json({ error: "Product not found." });
        return res.json(updatedProduct);
    }
    ;
    deleteProduct(req, res) {
        const deletedProduct = ProductService.delete(parseInt(req.params.id));
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found." });
        }
        return res.json(deletedProduct);
    }
    ;
}
export default new ProductController;
//# sourceMappingURL=ProductController.js.map