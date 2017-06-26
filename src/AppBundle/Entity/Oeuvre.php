<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Oeuvre
 *
 * @ORM\Table(name="oeuvre")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\OeuvreRepository")
 */
class Oeuvre
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=3)
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="url_product", type="string", length=255)
     */
    private $url_product;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=20)
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var string
     *  
     * @ORM\Column(name="url_image", type="string", length=255)
     */
    private $url_image;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="publication_date", type="date")
     */
    private $publication_date;

    /**
     * @var boolean
     *
     * @ORM\Column(name="trends", type="boolean")
     */
    private $trends;

    /**
     * @var \int
     *
     * @ORM\Column(name="rating", type="integer")
     */
    private $rating;

    /**
     * @ORM\ManyToOne(targetEntity="Author", inversedBy="oeuvres")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    private $author;

    /**
     * @ORM\ManyToOne(targetEntity="Category", inversedBy="oeuvres")
     * @ORM\JoinColumn(name="category_id", referencedColumnName="id")
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="SubCategory", inversedBy="oeuvres")
     * @ORM\JoinColumn(name="subcategory_id", referencedColumnName="id")
     */
    private $subCategory;

    /**
     * @ORM\OneToMany(targetEntity="Salon", mappedBy="oeuvre")
     */
    private $salons;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Oeuvre
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set urlProduct
     *
     * @param string $urlProduct
     *
     * @return Oeuvre
     */
    public function setUrlProduct($urlProduct)
    {
        //if($urlProduct !== null) {
            $this->url_product = $urlProduct;

            return $this;
        //}
    }

    /**
     * Get urlProduct
     *
     * @return string
     */
    public function getUrlProduct()
    {
        return $this->url_product;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Oeuvre
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set urlImage
     *
     * @param string $urlImage
     *
     * @return Oeuvre
     */
    public function setUrlImage($urlImage)
    {
        $this->url_image = $urlImage;

        return $this;
    }

    /**
     * Get urlImage
     *
     * @return string
     */
    public function getUrlImage()
    {
        return $this->url_image;
    }

    /**
     * Set publicationDate
     *
     * @param \DateTime $publicationDate
     *
     * @return Oeuvre
     */
    public function setPublicationDate($publicationDate)
    {
        $this->publication_date = $publicationDate;

        return $this;
    }

    /**
     * Get publicationDate
     *
     * @return \DateTime
     */
    public function getPublicationDate()
    {
        return $this->publication_date;
    }

    /**
     * Set author
     *
     * @param \AppBundle\Entity\Author $author
     *
     * @return Oeuvre
     */
    public function setAuthor(\AppBundle\Entity\Author $author = null)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return \AppBundle\Entity\Author
     */
    public function getAuthor()
    {
        return $this->author;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->salons = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add salon
     *
     * @param \AppBundle\Entity\Salon $salon
     *
     * @return Oeuvre
     */
    public function addSalon(\AppBundle\Entity\Salon $salon)
    {
        $this->salons[] = $salon;

        return $this;
    }

    /**
     * Remove salon
     *
     * @param \AppBundle\Entity\Salon $salon
     */
    public function removeSalon(\AppBundle\Entity\Salon $salon)
    {
        $this->salons->removeElement($salon);
    }

    /**
     * Get salons
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSalons()
    {
        return $this->salons;
    }

    /**
     * Set rating
     *
     * @param integer $rating
     *
     * @return Oeuvre
     */
    public function setRating($rating)
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * Get rating
     *
     * @return integer
     */
    public function getRating()
    {
        return $this->rating;
    }

    /**
     * Set category
     *
     * @param \AppBundle\Entity\Category $category
     *
     * @return Oeuvre
     */
    public function setCategory(\AppBundle\Entity\Category $category = null)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Get category
     *
     * @return \AppBundle\Entity\Category
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * Set subCategory
     *
     * @param \AppBundle\Entity\SubCategory $subCategory
     *
     * @return Oeuvre
     */
    public function setSubCategory(\AppBundle\Entity\SubCategory $subCategory = null)
    {
        $this->subCategory = $subCategory;

        return $this;
    }

    /**
     * Get subCategory
     *
     * @return \AppBundle\Entity\SubCategory
     */
    public function getSubCategory()
    {
        return $this->subCategory;
    }

    /**
     * Set trends
     *
     * @param boolean $trends
     *
     * @return Oeuvre
     */
    public function setTrends($trends)
    {
        $this->trends = $trends;
 
       return $this;
    }

    /**
     * Get trends
     *
     * @return boolean
     */
    public function getTrends()
    {
        return $this->trends;
    }
}
