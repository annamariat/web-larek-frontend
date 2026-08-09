const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

require('dotenv').config({
  path: path.join(process.cwd(), process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env')
});

const isProduction = process.env.NODE_ENV === "production";
const repoName = "/web-larek-frontend/"; // имя твоего репозитория на GitHub

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.ts",
  devtool: isProduction ? false : "source-map", // в продакшене source-map лучше отключать ради размера
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/images/[name].[hash][ext]",
    publicPath: isProduction ? repoName : "/", // для GitHub Pages
    clean: true, // <-- ВАЖНО: каждый раз чистит dist перед сборкой
  },
  devServer: {
    open: true,
    host: "localhost",
    watchFiles: ["src/pages/*.html"],
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css" // добавляем хэш, чтобы браузер не кэшировал старые CSS
    }),
    new DefinePlugin({
      'process.env.DEVELOPMENT': !isProduction,
      'process.env.API_ORIGIN': JSON.stringify(process.env.API_ORIGIN ?? '')
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: [/node_modules/]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "resolve-url-loader", {
          loader: "sass-loader",
          options: {
            sourceMap: true,
            sassOptions: {
              includePaths: ["src/scss"]
            }
          }
        }],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true
      }
    })]
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};