<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class GoogleBooksApiController extends Controller
{
    /**
     * @Route("/getBooks/{research}", name="search_books")
     */
    public function getBooksAction($research)
    {
        $research = str_replace(' ', '%', $research);
        $research = str_replace('q=', '', $research);

        $api_key = $this->container->getParameter('api_key');

        $url = "https://www.googleapis.com/books/v1/volumes?q=".urlencode($research)."&key=".urlencode($api_key)."&maxResults=5";

        $result = file_get_contents($url);
        $result = json_decode($result, true);

        //var_dump($result);die;

        if ($result) {
            foreach ($result['items'] as $item) {
                $authors = (empty($item['volumeInfo']['authors'][0])) ? '' : $item['volumeInfo']['authors'][0];
                $title = (empty($item['volumeInfo']['title'])) ? '' : $item['volumeInfo']['title'];
                $url_product = (empty($item['volumeInfo']['infoLink'])) ? '' : $item['volumeInfo']['infoLink'];
                $description = (empty($item['volumeInfo']['description'])) ? '' : $item['volumeInfo']['description'];
                $url_image = (empty($item['volumeInfo']['imageLinks']['thumbnail'])) ? '' : $item['volumeInfo']['imageLinks']['thumbnail'];
                $publication_date = (empty($item['volumeInfo']['publishedDate'])) ? '' : $item['volumeInfo']['publishedDate'];
                $id_google_books_api = (empty($item['id'])) ? '' : $item['id'];
                $sub_category = (empty($item['volumeInfo']['categories'][0])) ? '' : $item['volumeInfo']['categories'][0];

                $response[] = ['authors' => $authors, 'title' => $title, 'url_product' => $url_product, 'description' => $description, 'url_image' => $url_image, 'publication_date' => $publication_date, 'id_google_books_api' => $id_google_books_api,
                   'sub_category' => $sub_category ];
            }
        }
        return new JsonResponse($response);
    }
}
