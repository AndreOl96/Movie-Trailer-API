import FileService from "../utils/FileService.js";
import jsonFileReader from "../utils/jsonFileReader.js";
const productsPath = "./src/data/products.json";
class ProductService {
    getAll() {
        return jsonFileReader.readFileJson(productsPath);
    }
    ;
    getOne(productId) {
        const products = jsonFileReader.readFileJson(productsPath);
        return products.find(product => product.id === productId);
    }
    ;
    create(productData, imageFile) {
        const { title, price, description, category } = productData;
        const products = jsonFileReader.readFileJson(productsPath);
        const lastId = products.length > 0 ? products[products.length - 1].id : 0;
        let image = "no-image.jpg";
        const newProduct = {
            id: lastId + 1,
            title,
            price,
            description,
            category,
            image
        };
        if (imageFile) {
            newProduct.image = FileService.save(imageFile);
        }
        products.push(newProduct);
        jsonFileReader.writeFileJson(productsPath, products);
        return newProduct;
    }
    ;
    update(productData, productId, productImage) {
        const { title, price, description, category } = productData;
        const products = jsonFileReader.readFileJson(productsPath);
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex === -1)
            return undefined;
        const updatedProduct = {
            id: productId,
            title, price, description, category,
            image: products[productIndex].image
        };
        if (productImage) {
            FileService.delete(products[productIndex].image);
            updatedProduct.image = FileService.save(productImage);
        }
        products[productIndex] = updatedProduct;
        jsonFileReader.writeFileJson(productsPath, products);
        return updatedProduct;
    }
    ;
    delete(productId) {
        const products = jsonFileReader.readFileJson(productsPath);
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            return undefined;
        }
        FileService.delete(products[productIndex].image);
        const deletedProduct = products.splice(productIndex, 1);
        jsonFileReader.writeFileJson(productsPath, products);
        return deletedProduct[0];
    }
    ;
}
export default new ProductService;
//# sourceMappingURL=ProductService.js.map